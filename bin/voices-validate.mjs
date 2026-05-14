#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { buildValidationSummary } from "../src/corpus/validate.mjs";

async function main() {
  const path = process.argv[2];
  if (!path) {
    console.error("usage: voices-validate <corpus-entry.json>");
    process.exitCode = 2;
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    console.error(JSON.stringify({
      valid: false,
      trainable: false,
      errors: [`failed to read or parse ${path}: ${error.message}`],
    }, null, 2));
    process.exitCode = 1;
    return;
  }

  const summary = buildValidationSummary(parsed);
  console.log(JSON.stringify(summary, null, 2));
  process.exitCode = summary.valid ? 0 : 1;
}

main();
