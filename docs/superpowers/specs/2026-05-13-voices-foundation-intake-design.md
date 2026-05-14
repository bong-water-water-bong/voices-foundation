# Voices Foundation Intake Design

## Goal

Build the first usable open-source scaffold for `voices-foundation`: a local-first recording and consent intake app plus a corpus validation CLI for Indigenous language preservation work.

## Scope

This first version does not train a model. It creates the trusted substrate that later ASR, tokenizer, TTS, and model-training tools need:

- public framework code and documentation,
- no committed community data,
- JSON schemas for speaker consent, recording sessions, corpus entries, and manifests,
- a browser app for creating speaker/session/segment metadata and recording audio locally,
- a CLI validator that rejects entries without consent and restriction tags,
- example fixtures that demonstrate the format without using real elder recordings.

## Architecture

The project is a static web app plus a dependency-light Node CLI.

- `apps/intake-web/` is a local browser app. It stores working state in the browser, records audio with `MediaRecorder` when available, creates sidecar metadata, and exports corpus-entry JSON.
- `src/corpus/` contains pure validation and manifest logic used by both the CLI and tests.
- `bin/voices-validate.mjs` validates corpus-entry JSON files from the command line.
- `schemas/` documents the JSON object shapes for future implementations in Rust, Python, or other languages.
- `examples/` contains non-sensitive demo entries only.

## Data Boundaries

The repo contains code, schemas, and examples. It must not contain real recordings, real elder consent records, real transcripts, voice embeddings, trained community models, or restricted cultural material.

The app defaults to fail-closed validation:

- `speaker_id` is required.
- `consent_record_uri` is required.
- `restriction_tag` is required and must be one of `open`, `community`, `family`, `restricted`, or `withdrawn`.
- `withdrawn` entries are valid records but not trainable.
- `restricted`, `family`, and `community` entries are not trainable by default.
- Only `open` entries with approved transcription status are marked trainable by the default validator.

## User Workflow

1. Open the local intake app.
2. Enter speaker, language, consent, dialect/variant, recordist, and topic metadata.
3. Select the restriction tag before saving a segment.
4. Optionally record audio in the browser.
5. Export a corpus-entry JSON sidecar.
6. Run `npm run validate:example` or `node bin/voices-validate.mjs path/to/entry.json`.

## Testing

Use Node's built-in test runner.

Tests cover:

- valid open entries pass and are trainable,
- missing consent fails,
- missing or invalid restriction tag fails,
- restricted entries validate but are not trainable,
- withdrawn entries validate but are not trainable,
- app state helpers create exportable sidecars.
