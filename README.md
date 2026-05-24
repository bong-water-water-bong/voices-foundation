# voices-foundation

**→ [Project Wiki](docs/wiki/README.md)** — architecture, decisions, gotchas, and agent onboarding.


> Open-source framework for building large language models that preserve and teach Indigenous languages — starting with Mi'kmaq, designed to extend to any low-resource language community in the world.

## Why

Most of the world's ~7,000 languages are absent from every frontier LLM. Indigenous languages are absent *because* their speakers were forcibly silenced. The damage continues every year a fluent elder passes without their voice, vocabulary, and idiom being preserved in a form a learner can interact with.

This project is a **foundation**, not a single model. It is the tooling, the protocols, the data formats, and the reference architecture for any community to:

1. Record fluent speakers with proper consent, on the community's terms
2. Transcribe and align audio with text
3. Train a small, efficient language model on the community's corpus
4. Build voice-cloned TTS that preserves the actual voices of the actual speakers
5. Compose multiple speaker voices into reusable, attributable "voice actors"
6. Deploy a teaching interface the community fully controls

## What this is not

- **Not a service.** Not SaaS. Not a hosted API the community has to depend on.
- **Not a data pipeline owned by anyone outside the community.**
- **Not a one-size-fits-all model.** Each language community gets its own model, trained on their own data, with their own rules about what is in and what is sacred.
- **Not affiliated** with any vendor, university, or government agency unless explicitly invited by a community.

## Status

🚧 First working scaffold. The repo now includes a local intake web app, JSON schemas, a corpus-entry validator, and demo fixtures. It does **not** include real recordings, real transcripts, elder consent records, voice embeddings, or trained models.

## Repository layout

```text
voices-foundation/
├── README.md
├── GOVERNANCE.md
├── ARCHITECTURE.md
├── ROADMAP.md
├── CONTRIBUTING.md
├── apps/
│   └── intake-web/              # local recording + sidecar app
├── bin/
│   └── voices-validate.mjs      # corpus-entry validator CLI
├── docs/
│   ├── data-sovereignty.md
│   ├── recording-protocols.md
│   ├── speaker-consent-template.md
│   └── voice-actor-spec.md
├── examples/
│   └── demo-open-entry.json     # non-sensitive fixture
├── schemas/
│   ├── speaker.schema.json
│   ├── recording-session.schema.json
│   ├── corpus-entry.schema.json
│   └── corpus-manifest.schema.json
├── src/
│   └── corpus/                  # validation library
└── tests/
```

## Run the intake app

The intake app is static and local-first. Serve it from localhost so browser audio recording works:

```bash
npm run serve:intake
```

Then open:

```text
http://127.0.0.1:8766
```

The app creates corpus-entry sidecar JSON. It does not upload audio or metadata anywhere.

## Validate a corpus entry

```bash
npm run validate:example
node bin/voices-validate.mjs path/to/corpus-entry.json
```

Validation is fail-closed. Consent and restriction tags are required. By default, only `open` entries with `approved` transcription status are trainable.

## Test

```bash
npm test
npm run check:js
```

## License

- **Code:** Apache-2.0
- **Data:** never under the code license. Each community holds its own corpus license. See `docs/data-sovereignty.md`.

## First pilot

Mi'kmaq, in partnership with communities in Mi'kma'ki (currently New Brunswick), beginning with elder speakers who have given free, prior, and informed consent.
