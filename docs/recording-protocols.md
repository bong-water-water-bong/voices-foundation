# Recording protocols

## Hardware (per-station, budget ~$250)

> [!TODO] Finalize the recommended combo. Current candidates:
> - **Shure MV7+** USB/XLR dynamic — $279, very tolerant of room acoustics
> - **Rode NT-USB+** condenser — $169, sharper detail but room-sensitive
> - **Audio-Technica AT2020 + Focusrite Scarlett Solo** combo — ~$200, XLR path
>
> Decision factors: forgiving acoustics matter more than studio quality, since elders' homes will not be treated rooms. Lean toward dynamic mics.

Additional per-station:
- Pop filter
- Boom arm or short desk stand
- Closed-back headphones for the recordist (not the speaker)
- Two SSDs: one for primary capture, one for redundant backup

## Environment

- Quiet room, soft furnishings (couches, curtains, rugs absorb reflections)
- HVAC and refrigerators off during recording
- No phones in the room (vibration, RF noise, distraction)
- Two-channel recording where possible: speaker mic + ambient/backup
- Sessions ≤ 60 minutes; vocal fatigue is real, especially for older speakers

## Session structure

> [!TODO] Adapt with community input. Starting template:

1. **Greeting + consent on tape** (2 min)
   Speaker confirms consent verbally, in their language and/or English, on the recording itself. The recording is the consent record.

2. **Free conversation** (15–20 min)
   Open-ended. Speaker chooses the topic. This is the most natural prosody data.

3. **Structured prompts** (15–20 min)
   - Kinship terms
   - Body parts
   - Seasons, weather, geography
   - Place names (with locations)
   - Traditional foods and preparation
   - Numbers and counting
   - Common greetings and farewells

4. **Story or memory** (10–15 min)
   A story the speaker wants to tell. Important: **speaker designates restriction level** before recording (open / community-only / family-only / sacred-do-not-train).

5. **Read-aloud** (5–10 min, optional)
   Where written texts exist. Useful for ASR alignment.

6. **Closing**
   Verbal confirmation that what was recorded matches what was consented to.

## File naming and metadata

Suggested schema:

```
YYYYMMDD_speakerID_sessionN_segmentN.wav
YYYYMMDD_speakerID_sessionN_segmentN.json    ← sidecar metadata
```

Sidecar JSON minimum fields:
- `speaker_id`
- `consent_record_uri` (link to signed consent doc)
- `recorded_at` (ISO 8601)
- `restriction_tag` (one of: open / community / family / restricted)
- `language_variant` (dialect, region)
- `topic_keywords` (free-form, community-curated)
- `recordist`
- `transcription_status` (none / draft / reviewed / approved)

> [!TODO] Finalize schema and put it in `crates/corpus/schemas/`.

## Backup discipline

- Primary: local SSD at recording station
- Secondary: community-controlled cold storage (encrypted, offline)
- **No cloud unless community-approved provider**, and even then encrypted at rest with community-held keys

## Quality checks before transcription

- Clipping check (peak level < -3 dB)
- Background noise floor < -50 dB
- No more than 10s contiguous silence (auto-trim or mark)
- Speaker identified in every segment

> [!TODO] Build a `crates/corpus/qc` audit tool that runs these automatically and flags failures.
