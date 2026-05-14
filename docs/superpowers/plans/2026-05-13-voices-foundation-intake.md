# Voices Foundation Intake Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new open-source `voices-foundation` repo with docs, schemas, a local intake web app, and a corpus validation CLI.

**Architecture:** The first product is local-first and dependency-light: a static browser app for metadata/audio capture and pure Node modules for corpus validation. Community data stays outside git; only schemas, examples, and code live in the repo.

**Tech Stack:** Node ESM, browser `MediaRecorder`, HTML/CSS/JS, JSON Schema documentation, Node built-in test runner.

---

### Task 1: Repo Foundation

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `LICENSE`
- Modify: `README.md`

- [x] Create project metadata and scripts.
- [x] Ignore generated data, audio, transcripts, model artifacts, and local state.
- [x] Choose Apache-2.0 for framework code.
- [x] Keep data license separate from code license.

### Task 2: Corpus Validation

**Files:**
- Create: `src/corpus/restrictions.mjs`
- Create: `src/corpus/validate.mjs`
- Create: `bin/voices-validate.mjs`
- Create: `tests/corpus-validator.test.mjs`
- Create: `examples/demo-open-entry.json`

- [x] Write tests first for valid, missing-consent, invalid-tag, restricted, and withdrawn cases.
- [x] Verify tests fail before implementation.
- [x] Implement pure validation functions and CLI.
- [x] Verify tests pass.

### Task 3: Schemas

**Files:**
- Create: `schemas/speaker.schema.json`
- Create: `schemas/recording-session.schema.json`
- Create: `schemas/corpus-entry.schema.json`
- Create: `schemas/corpus-manifest.schema.json`

- [x] Encode required fields from the recording protocol.
- [x] Include consent and restriction metadata as required fields.
- [x] Keep schemas readable for other language implementations.

### Task 4: Intake App

**Files:**
- Create: `apps/intake-web/index.html`
- Create: `apps/intake-web/styles.css`
- Create: `apps/intake-web/src/intake-state.mjs`
- Create: `apps/intake-web/src/app.mjs`
- Create: `tests/intake-state.test.mjs`

- [x] Write tests first for sidecar creation and trainability summary.
- [x] Verify tests fail before implementation.
- [x] Build a local app that creates speaker/session/segment records.
- [x] Add browser audio recording when available.
- [x] Export corpus-entry JSON.

### Task 5: Verification

**Files:**
- Verify all project files.

- [x] Run `npm test`.
- [x] Run `npm run validate:example`.
- [x] Run syntax checks for all JS modules.
- [x] Start a local server for the intake app.
