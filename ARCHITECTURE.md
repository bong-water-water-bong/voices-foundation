# Architecture

## Pipeline

```
[Elder speakers]
     │
     │  consent + recording protocol  (docs/recording-protocols.md)
     ▼
[Raw audio + speaker metadata]                  ◄── crates/corpus
     │
     │  content-addressed, restriction-tagged
     ▼
[Aligned transcription]                         ◄── crates/transcribe
     │
     │  ASR baseline + human-in-the-loop correction
     ▼
[Tokenized corpus]                              ◄── crates/tokenize
     │
     │  morpheme-aware
     ▼
[Base LM]                                       ◄── crates/train
     │
     ▼
[Per-speaker voice embeddings]                  ◄── crates/synth
     │
     ▼
[Voice actor registry]                          ◄── crates/mix
     │
     ▼
[Teaching interface]                            ◄── crates/api + crates/teach
```

## Key technical decisions

### Tokenization

Most Indigenous languages this project targets are morphologically rich. Mi'kmaq is **polysynthetic** — a single word can encode subject, object, verb, tense, evidentiality. Naive BPE will fragment in destructive ways.

Options to evaluate:
- Morpheme-aware tokenization with linguistic input
- Character-level (simple, robust to small corpora, slower inference)
- Hybrid: morpheme-aware where a morpheme list exists, char fallback

> [!TODO] Decide for Mi'kmaq pilot. Reach out to existing Mi'kmaq linguistic resources (Mi'gmaq Online dictionary, Bernard Francis's orthography) before settling.

### Base model

Small, efficient, **runs locally**. Aligns with the `1bit.systems` ternary inference work — a ~100M–1B BitNet-style model is plenty for a low-resource language and runs on Strix Halo (or eventually on a phone).

Three approaches to evaluate:
1. Train from scratch on the language corpus
2. Continued pretraining from a multilingual base (XLM-R, NLLB, mT5)
3. Distill from a larger teacher

> [!TODO] (1) is most defensible for sovereignty (no foreign-trained weights baked in) but needs more data. (2) is most practical. Decide after first corpus is sized.

### ASR bootstrap

Whisper baseline → fine-tune on whatever transcribed audio exists → human-in-the-loop correction → iterate. The `transcribe` crate must support correction workflows, not just inference.

Note: Whisper's training data has known colonial-extraction issues (see Mahelona et al. 2023). Acceptable as a bootstrap tool, not as a long-term dependency. Replace with a community-trained ASR once enough labeled data exists.

### Voice cloning / TTS

Per-speaker embeddings. Reference architectures to evaluate:
- **XTTS-v2** — strong cross-lingual, well-documented
- **F5-TTS** — newer, flow-matching, fast inference
- **StyleTTS 2** — high quality, smaller footprint
- **Tortoise** — slow but high quality, useful for offline narration

Each speaker embedding is a **first-class object** with metadata: speaker ID, consent record reference, recording date, restriction policy.

### Voice actor composition (the novel piece)

Speaker embeddings live in a continuous latent space. Two embeddings can be linearly interpolated, weighted-blended, or style-transferred. A **voice actor** can be:

- A single speaker
- A blend of multiple consented speakers
- A blend with explicit attribution to all source speakers

Use cases: audiobook narration (one actor per character), language teaching apps (multiple example voices per phrase), multi-character storytelling generated from a transcript.

> [!TODO] Design the composition API and the attribution model. Composed actors must record their constituents and invalidate if any source withdraws consent. Spec in `docs/voice-actor-spec.md`.

### Inference target

The whole stack must run locally on community-owned hardware. **No required cloud dependency.** Mirror the `1bit.systems` design discipline:
- Pure C++ inference, no Python at runtime
- Ternary weights where applicable (BitNet b1.58 or sparse 2:4 variants)
- Strix Halo as the reference target; ARM/edge later

## Workspace layout (proposed)

```
crates/
  corpus/        # ingest, content-addressed storage, restriction tagging
  transcribe/    # ASR + correction workflow
  tokenize/      # morpheme-aware tokenizer
  train/         # model training
  synth/         # TTS, per-speaker embedding generation
  mix/           # voice actor composition + attribution
  api/           # OpenAI/Ollama-compatible serving
  teach/         # learner-facing app (PWA, sibling to 1bit.systems /voice/)
```

> [!TODO] Confirm with first prototype. Consider a `linguistics/` crate for morpheme rules and orthography helpers, separate from `tokenize`.

## Non-goals

- Multi-language single model (each community trains its own)
- Cloud-only deployment
- Real-time multi-speaker conversation (initially — could come later)
- Translation between Indigenous languages (out of scope; that's a different ethical conversation)
