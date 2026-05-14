# Voice actor specification

## Concept

A **voice actor** is a named, reusable voice identity that can be loaded into a synthesis pipeline and produce speech in the target language. It is defined by:

- A **speaker embedding** (vector in TTS latent space)
- **Attribution metadata** — which real speakers contributed
- A **consent chain** — consent records for every contributing speaker
- A **restriction policy** — what this actor can and cannot be used for

The actor is **the unit of composition** in this framework. The novelty is treating it as a first-class type with cryptographic attribution, not as a hidden detail of the TTS model.

## Types

### Single-speaker actor
Wraps one real speaker. Embedding is computed directly from that speaker's recordings. Attribution is one-to-one. Withdrawal removes the actor.

### Composed actor
Blend of multiple speaker embeddings. Composition modes:

- **Linear interpolation** — weighted average of embeddings
- **Style transfer** — timbre from speaker A, prosody from speaker B
- **Cross-attribute blend** — e.g. cross-gender or cross-age blends, **only with explicit consent from every source speaker for that specific composition type**

Composed actors carry attribution to **all** sources. If any source speaker withdraws consent, the composed actor is invalidated and must be recomputed without them.

## Use cases

- **Audiobook narration** — assign each character a different actor
- **Language teaching app** — multiple example voices for the same phrase, so learners hear variation
- **Multi-character dialogue** generated from a transcript or script
- **Children's stories** — community-approved blends suited for child-friendly content

## API sketch (placeholder)

Lives in `crates/mix/`. Not implemented yet.

```rust
use voices_mix::{VoiceActor, ComposeMode};

// Load consented speakers from the community registry.
let mary  = VoiceActor::from_speaker("mary_johnson_2026")?;
let joe   = VoiceActor::from_speaker("joe_levi_2026")?;

// Compose a new actor. This fails if any source speaker has not
// consented to "compose" use.
let blended = VoiceActor::compose(
    &[(&mary, 0.6), (&joe, 0.4)],
    ComposeMode::LinearInterpolation,
)?;

// Synthesize. Attribution is carried in the audio sidecar.
let clip = blended.synthesize("Wela'lin nikmaq.", &lang_mikmaq)?;

// clip.attribution() returns:
//   [ ("mary_johnson_2026", 0.6), ("joe_levi_2026", 0.4) ]
```

## Invariants

The `mix` crate must enforce, at compile- or run-time:

1. **No actor without attribution.** Every actor instance carries a non-empty source list.
2. **No use beyond consent.** If composition mode X is not in the speaker's consent record, composition fails.
3. **Withdrawal propagates.** When a speaker's record is marked withdrawn, every actor referencing them is marked invalid on next load.
4. **No silent gender or age remapping.** Cross-attribute composition requires a flag and the corresponding consent.

## Audio sidecar

Every audio clip produced by the system carries a sidecar manifest:

```json
{
  "actor": "blended_mary_joe_v1",
  "sources": [
    { "speaker": "mary_johnson_2026", "weight": 0.6 },
    { "speaker": "joe_levi_2026",     "weight": 0.4 }
  ],
  "compose_mode": "linear_interpolation",
  "language": "mikmaq",
  "text": "Wela'lin nikmaq.",
  "generated_at": "2026-MM-DDTHH:MM:SSZ",
  "consent_chain": [
    "consent://mary_johnson_2026/v3",
    "consent://joe_levi_2026/v1"
  ]
}
```

This sidecar travels with the audio. Strip it and the audio is no longer authorized for use under the data license.

> [!TODO] Decide whether sidecars are embedded in audio metadata (e.g. WAV INFO chunks, FLAC tags) or distributed alongside. Embedded is more tamper-resistant; sidecar is more flexible.

## Open questions

- How are actor versions handled when a contributing speaker re-records (improving the embedding)?
- Should there be a "community house style" actor — a community-blessed default voice — and if so, what's the governance over its composition?
- How does this interact with multilingual TTS? An actor trained on Mi'kmaq speech, asked to speak English — is that allowed? What about the reverse (English-trained actor speaking Mi'kmaq)? The latter is likely unacceptable; the former needs community input.

> [!TODO] These are governance questions, not engineering questions. Raise with first community partner.
