import { buildValidationSummary } from "../../../src/corpus/validate.mjs";

export function createEmptyIntakeState() {
  return {
    speaker: {
      speaker_id: "",
      display_name: "",
    },
    session: {
      language: "mikmaq",
      language_variant: "",
      consent_record_uri: "",
      recordist: "",
    },
    segment: {
      restriction_tag: "",
      topic_keywords: "",
      transcription_status: "none",
      audio_uri: "",
      sha256: "",
      duration_seconds: "",
      notes: "",
    },
  };
}

function slugPart(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "entry";
}

function splitKeywords(value) {
  return String(value || "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

function parseDuration(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function buildCorpusEntry(state, now = new Date()) {
  const speakerId = state.speaker.speaker_id.trim();
  const language = state.session.language.trim();
  const timestamp = now.toISOString();
  const entryId = [
    "entry",
    slugPart(language),
    slugPart(speakerId),
    timestamp.replace(/[-:.TZ]/g, "").slice(0, 14),
  ].join("_");

  const entry = {
    entry_id: entryId,
    speaker_id: speakerId,
    speaker_display_name: state.speaker.display_name.trim(),
    language,
    language_variant: state.session.language_variant.trim(),
    consent_record_uri: state.session.consent_record_uri.trim(),
    recorded_at: timestamp,
    restriction_tag: state.segment.restriction_tag.trim(),
    topic_keywords: splitKeywords(state.segment.topic_keywords),
    recordist: state.session.recordist.trim(),
    transcription_status: state.segment.transcription_status.trim(),
    notes: state.segment.notes.trim(),
  };

  const audioUri = state.segment.audio_uri.trim();
  const sha256 = state.segment.sha256.trim();
  const duration = parseDuration(state.segment.duration_seconds);
  if (audioUri || sha256 || duration > 0) {
    entry.media = {
      audio_uri: audioUri,
      sha256,
      duration_seconds: duration,
    };
  }

  return entry;
}

export function summarizeEntry(entry) {
  return buildValidationSummary(entry);
}

export function toDownload(filename, data) {
  return {
    filename,
    href: `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`,
  };
}
