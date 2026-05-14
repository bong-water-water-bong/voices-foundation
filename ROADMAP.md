# Roadmap

## Phase 0 — Foundation (now)
- [ ] GOVERNANCE.md ratified with first community partner (Metepenagiag or other Mi'kma'ki community)
- [ ] Speaker consent template translated and approved
- [ ] Recording protocol drafted and tested with one speaker
- [ ] Language Authority + Speaker Council identified for pilot
- [ ] Data license drafted (likely Kaitiakitanga-derived)
- [ ] Code license chosen (MIT or Apache 2.0)

## Phase 1 — Mi'kmaq pilot recording
- [ ] First 3–5 elder speakers recorded under protocol
- [ ] Recording rig sourced (~$250 per station, see `docs/recording-protocols.md`)
- [ ] First ~50 hours of structured audio collected
- [ ] Transcription workflow stood up (whisper bootstrap + human correction)
- [ ] `crates/corpus` skeleton: content-addressed storage, restriction tags, signed manifests

## Phase 2 — First model
- [ ] Tokenizer designed and trained
- [ ] Small base LM trained on Mi'kmaq corpus (target: 100M–500M params, ternary)
- [ ] Per-speaker TTS embeddings generated for all consented speakers
- [ ] Voice actor composition prototype (`crates/mix`)
- [ ] Local-only inference verified on Strix Halo

## Phase 3 — Teaching interface
- [ ] Learner-facing app: text + audio, query by phrase, hear it in an elder's voice
- [ ] Speaker selection UI (which elder do you want to learn from today?)
- [ ] Community feedback loop
- [ ] First handoff to Metepenagiag

## Phase 4 — Framework generalization
- [ ] Extract Mi'kmaq-specific assumptions into per-language config
- [ ] Document onboarding playbook for a second language community
- [ ] First non-Mi'kmaq pilot

## Phase 5 — Federation
- [ ] Multiple language communities running their own instances
- [ ] Optional shared tooling, **no shared data**
- [ ] Voice actor composition stays per-community

## Anti-goals (will not pursue)
- Hosted SaaS
- Cross-language aggregated model
- Synthetic / non-attributed voices
- Public download of community-restricted material
- Grant-funded "open dataset" releases that bypass community control
