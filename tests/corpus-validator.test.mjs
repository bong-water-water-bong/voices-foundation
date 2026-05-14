import test from "node:test";
import assert from "node:assert/strict";

import {
  isTrainableByDefault,
  validateCorpusEntry,
} from "../src/corpus/validate.mjs";

const baseEntry = {
  entry_id: "entry_demo_open_001",
  speaker_id: "speaker_demo_001",
  language: "mikmaq",
  language_variant: "mi-kma-ki-nb-demo",
  consent_record_uri: "consent://speaker_demo_001/v1",
  recorded_at: "2026-05-13T20:00:00Z",
  restriction_tag: "open",
  topic_keywords: ["greeting", "demo"],
  recordist: "demo-recordist",
  transcription_status: "approved",
  media: {
    audio_uri: "recordings/demo/audio.wav",
    sha256: "0".repeat(64),
    duration_seconds: 12.4,
  },
};

test("valid open approved corpus entry passes and is trainable", () => {
  const result = validateCorpusEntry(baseEntry);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
  assert.equal(isTrainableByDefault(baseEntry), true);
});

test("entry without consent record fails validation", () => {
  const entry = { ...baseEntry };
  delete entry.consent_record_uri;
  const result = validateCorpusEntry(entry);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /consent_record_uri/);
});

test("entry without restriction tag fails validation", () => {
  const entry = { ...baseEntry };
  delete entry.restriction_tag;
  const result = validateCorpusEntry(entry);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /restriction_tag/);
});

test("entry with invalid restriction tag fails validation", () => {
  const entry = { ...baseEntry, restriction_tag: "public" };
  const result = validateCorpusEntry(entry);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /invalid restriction_tag/);
});

test("restricted entry validates as a record but is not trainable by default", () => {
  const entry = { ...baseEntry, restriction_tag: "restricted" };
  const result = validateCorpusEntry(entry);
  assert.equal(result.valid, true);
  assert.equal(isTrainableByDefault(entry), false);
});

test("withdrawn entry validates as a record but is not trainable by default", () => {
  const entry = { ...baseEntry, restriction_tag: "withdrawn" };
  const result = validateCorpusEntry(entry);
  assert.equal(result.valid, true);
  assert.equal(isTrainableByDefault(entry), false);
});
