# Project Wiki: voices-foundation

> **Agent onboarding:** Read this file first. It tells you what the project is, how to run it, and what's in flight. You should not need to guess.

## Mission
Open-source framework for building language models that preserve and teach Indigenous languages. The first target is Mi'kmaq, but every component is designed to extend to any low-resource language community. The project provides the **tooling stack** — consent-aware recording intake, ASR transcription, corpus validation, voice cloning, and a teaching deployment — not a hosted service. Communities own their data.

## Architecture
```
Recording App (apps/intake/)
  → Consent-gated audio + text capture
  → JSON schemas (schemas/) validate every entry
        ↓
Corpus Pipeline (bin/ + apps/validator/)
  → Audio alignment via lemon-asr (OpenAI-compat ASR endpoint)
  → Corpus-entry validation against community rules
  → SRT/TXT/JSON triple output format
        ↓
Model Training (training/)
  → Small LM fine-tune on community corpus
  → Voice cloning (TTS) preserving actual speaker voices
  → Speaker attribution + consent metadata
        ↓
Teaching Interface (apps/teaching/)
  → Local deployment, community-controlled
  → No cloud dependency
```

## How to Test / Run
```bash
# Install
pip install -e ".[dev]"

# Run intake app
python apps/intake/main.py

# Validate a corpus entry
python -m voices_foundation.validate path/to/entry.json

# Run test suite
pytest tests/ -v
```

**Hot paths**:
- `apps/intake/` — web-based recording intake (consent forms, audio capture)
- `schemas/` — JSON schemas for corpus entries, consent records, voice profiles
- `bin/validate` — corpus-entry CLI validator
- `ARCHITECTURE.md` — detailed component breakdown
- `GOVERNANCE.md` — community consent and data ownership rules

## Current State
- v0.1 scaffold: intake app, JSON schemas, corpus-entry validator, demo fixtures
- Does NOT include real recordings, transcripts, elder consent records, or trained models
- First target community: Mi'kmaq
- ASR backend: designed to use `lemon-asr-server` (lemon-asr repo)

## Invariants
- **Consent is non-negotiable**: every corpus entry must have a valid consent record. Do not create code paths that skip consent validation.
- **Community data stays local**: no cloud upload paths. The `apps/` never call external APIs with audio or text.
- **Attribution is permanent**: voice embeddings carry speaker attribution that cannot be stripped.
- **Sacred content flag**: any entry with `sacred: true` in the schema is excluded from all model training and must never leave the community's system.

## Gotchas
- The intake app runs on localhost only — do not expose it to the internet
- Corpus validation is strict: a missing `consent_record_id` fails the entire entry, not just a warning
- Voice cloning requires a minimum of 30s clean audio per speaker

## Related
- [[lemon-asr]] — ASR server used for audio transcription in the corpus pipeline
- `GOVERNANCE.md` — community consent protocols
- `ARCHITECTURE.md` — detailed component design
