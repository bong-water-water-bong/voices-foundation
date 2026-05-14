import {
  buildCorpusEntry,
  createEmptyIntakeState,
  summarizeEntry,
  toDownload,
} from "./intake-state.mjs";

const state = createEmptyIntakeState();
let mediaRecorder = null;
let recordStartedAt = null;
let chunks = [];

const form = document.querySelector("#intake-form");
const output = document.querySelector("#entry-output");
const status = document.querySelector("#validation-status");
const trainable = document.querySelector("#trainable-status");
const downloadLink = document.querySelector("#download-entry");
const recordButton = document.querySelector("#record-audio");
const stopButton = document.querySelector("#stop-audio");
const audioPreview = document.querySelector("#audio-preview");

function readForm() {
  const data = new FormData(form);
  state.speaker.speaker_id = data.get("speaker_id") ?? "";
  state.speaker.display_name = data.get("display_name") ?? "";
  state.session.language = data.get("language") ?? "";
  state.session.language_variant = data.get("language_variant") ?? "";
  state.session.consent_record_uri = data.get("consent_record_uri") ?? "";
  state.session.recordist = data.get("recordist") ?? "";
  state.segment.restriction_tag = data.get("restriction_tag") ?? "";
  state.segment.topic_keywords = data.get("topic_keywords") ?? "";
  state.segment.transcription_status = data.get("transcription_status") ?? "";
  state.segment.audio_uri = data.get("audio_uri") ?? "";
  state.segment.sha256 = data.get("sha256") ?? "";
  state.segment.duration_seconds = data.get("duration_seconds") ?? "";
  state.segment.notes = data.get("notes") ?? "";
}

function render() {
  readForm();
  const entry = buildCorpusEntry(state);
  const summary = summarizeEntry(entry);
  output.value = JSON.stringify(entry, null, 2);
  status.textContent = summary.valid ? "Valid sidecar" : summary.errors.join("; ");
  status.dataset.state = summary.valid ? "ok" : "error";
  trainable.textContent = summary.trainable
    ? "Default training: allowed"
    : "Default training: blocked";
  trainable.dataset.state = summary.trainable ? "ok" : "blocked";

  const download = toDownload(`${entry.entry_id}.json`, entry);
  downloadLink.href = download.href;
  downloadLink.download = download.filename;
}

async function startRecording() {
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
    status.textContent = "Audio recording is not available in this browser. You can still create metadata.";
    status.dataset.state = "error";
    return;
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  chunks = [];
  mediaRecorder = new MediaRecorder(stream);
  recordStartedAt = performance.now();
  mediaRecorder.addEventListener("dataavailable", (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  });
  mediaRecorder.addEventListener("stop", () => {
    const blob = new Blob(chunks, { type: mediaRecorder.mimeType || "audio/webm" });
    const url = URL.createObjectURL(blob);
    audioPreview.src = url;
    audioPreview.hidden = false;
    const duration = ((performance.now() - recordStartedAt) / 1000).toFixed(2);
    form.elements.audio_uri.value = `recordings/${form.elements.speaker_id.value || "speaker"}/${Date.now()}.webm`;
    form.elements.duration_seconds.value = duration;
    form.elements.sha256.value = "";
    recordButton.disabled = false;
    stopButton.disabled = true;
    for (const track of stream.getTracks()) track.stop();
    render();
  });
  mediaRecorder.start();
  recordButton.disabled = true;
  stopButton.disabled = false;
  status.textContent = "Recording audio locally in this browser.";
  status.dataset.state = "ok";
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
}

form.addEventListener("input", render);
form.addEventListener("change", render);
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

render();
