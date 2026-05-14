import {
  isKnownRestrictionTag,
  isOpenForDefaultTraining,
} from "./restrictions.mjs";

const REQUIRED_STRING_FIELDS = Object.freeze([
  "entry_id",
  "speaker_id",
  "language",
  "consent_record_uri",
  "recorded_at",
  "restriction_tag",
]);

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasValidSha256(value) {
  return typeof value === "string" && /^[a-fA-F0-9]{64}$/.test(value);
}

export function validateCorpusEntry(entry) {
  const errors = [];

  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    return { valid: false, errors: ["entry must be an object"] };
  }

  for (const field of REQUIRED_STRING_FIELDS) {
    if (!isNonEmptyString(entry[field])) {
      errors.push(`${field} is required`);
    }
  }

  if (isNonEmptyString(entry.restriction_tag) && !isKnownRestrictionTag(entry.restriction_tag)) {
    errors.push(`invalid restriction_tag: ${entry.restriction_tag}`);
  }

  if (entry.media !== undefined) {
    if (!entry.media || typeof entry.media !== "object" || Array.isArray(entry.media)) {
      errors.push("media must be an object when present");
    } else {
      if (entry.media.audio_uri !== undefined && !isNonEmptyString(entry.media.audio_uri)) {
        errors.push("media.audio_uri must be a non-empty string when present");
      }
      if (entry.media.sha256 !== undefined && !hasValidSha256(entry.media.sha256)) {
        errors.push("media.sha256 must be a 64-character hex string when present");
      }
      if (
        entry.media.duration_seconds !== undefined
        && (
          typeof entry.media.duration_seconds !== "number"
          || !Number.isFinite(entry.media.duration_seconds)
          || entry.media.duration_seconds < 0
        )
      ) {
        errors.push("media.duration_seconds must be a non-negative number when present");
      }
    }
  }

  if (
    entry.topic_keywords !== undefined
    && (
      !Array.isArray(entry.topic_keywords)
      || entry.topic_keywords.some((keyword) => !isNonEmptyString(keyword))
    )
  ) {
    errors.push("topic_keywords must be an array of non-empty strings when present");
  }

  return { valid: errors.length === 0, errors };
}

export function isTrainableByDefault(entry) {
  const result = validateCorpusEntry(entry);
  if (!result.valid) return false;
  if (!isOpenForDefaultTraining(entry.restriction_tag)) return false;
  return entry.transcription_status === "approved";
}

export function buildValidationSummary(entry) {
  const result = validateCorpusEntry(entry);
  return {
    ...result,
    trainable: result.valid && isTrainableByDefault(entry),
    restriction_tag: entry?.restriction_tag ?? null,
    entry_id: entry?.entry_id ?? null,
  };
}
