import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCorpusEntry,
  createEmptyIntakeState,
  summarizeEntry,
} from "../apps/intake-web/src/intake-state.mjs";

test("buildCorpusEntry creates an exportable sidecar from intake state", () => {
  const state = createEmptyIntakeState();
  state.speaker.speaker_id = "speaker_demo_001";
  state.speaker.display_name = "Demo Speaker";
  state.session.language = "mikmaq";
  state.session.language_variant = "mi-kma-ki-nb-demo";
  state.session.consent_record_uri = "consent://speaker_demo_001/v1";
  state.session.recordist = "demo-recordist";
  state.segment.restriction_tag = "open";
  state.segment.topic_keywords = "greeting, demo";
  state.segment.transcription_status = "approved";
  state.segment.audio_uri = "recordings/demo/audio.wav";
  state.segment.sha256 = "1".repeat(64);
  state.segment.duration_seconds = "8.5";

  const entry = buildCorpusEntry(state);

  assert.equal(entry.speaker_id, "speaker_demo_001");
  assert.equal(entry.language, "mikmaq");
  assert.equal(entry.restriction_tag, "open");
  assert.deepEqual(entry.topic_keywords, ["greeting", "demo"]);
  assert.equal(entry.media.duration_seconds, 8.5);
});

test("summarizeEntry reports open approved entries as trainable", () => {
  const state = createEmptyIntakeState();
  state.speaker.speaker_id = "speaker_demo_001";
  state.session.language = "mikmaq";
  state.session.consent_record_uri = "consent://speaker_demo_001/v1";
  state.segment.restriction_tag = "open";
  state.segment.transcription_status = "approved";

  const summary = summarizeEntry(buildCorpusEntry(state));

  assert.equal(summary.valid, true);
  assert.equal(summary.trainable, true);
});
