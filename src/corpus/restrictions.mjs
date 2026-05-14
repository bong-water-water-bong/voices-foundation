export const RESTRICTION_TAGS = Object.freeze([
  "open",
  "community",
  "family",
  "restricted",
  "withdrawn",
]);

export const DEFAULT_TRAINABLE_TAGS = Object.freeze(["open"]);

export function isKnownRestrictionTag(tag) {
  return RESTRICTION_TAGS.includes(tag);
}

export function isOpenForDefaultTraining(tag) {
  return DEFAULT_TRAINABLE_TAGS.includes(tag);
}
