# Governance

This document is more important than any code in this repo. It comes first because every technical decision downstream is shaped by it.

## Core principle

> The language belongs to the community. The data belongs to the community. The model belongs to the community. The foundation provides tools; it does not extract.

## OCAP® — First Nations communities in Canada

This project operates under the OCAP principles defined by the **First Nations Information Governance Centre (FNIGC)**:

- **Ownership** — the community collectively owns its language data, recordings, transcriptions, and any derived models
- **Control** — the community controls every stage of the data lifecycle: collection, storage, use, disclosure, destruction
- **Access** — the community decides who can access what
- **Possession** — the community physically (or cryptographically) holds the data

## CARE — Indigenous data globally

For communities outside Canada, the **CARE principles** (Global Indigenous Data Alliance) apply alongside FAIR:

- **C**ollective Benefit
- **A**uthority to Control
- **R**esponsibility
- **E**thics

## FPIC

**Free, Prior, and Informed Consent** is required from:
- Any speaker before recording
- The community body representing speakers before deployment of any model trained on community data

Consent is revocable. The system must make revocation operationally real, not just contractual — see speaker withdrawal below.

## Sacred / restricted content

Some content is not for general circulation: ceremony, songs, names, certain stories. The community designates what is restricted.

The system **must**:
- Support marking corpus entries as restricted at ingestion time
- Fail closed if a restriction tag is missing or unverified — unmarked entries do **not** enter training
- Keep the tagging tamper-evident (signed manifests, content-addressed storage)

> [!TODO] Define the cryptographic mechanism. Candidate: content-addressed corpus with signed manifests per community-authorized curator. Spec lives in `crates/corpus/`.

## Speaker attribution

Every voice in the system is attributable to a **named, consented individual**. No "anonymous synthesized voice." No gender swapping. No identity stripping.

If a speaker withdraws consent:
1. Their audio is removed from active corpus
2. Their voice embedding is purged from the actor registry
3. Any composed actor that included them is invalidated
4. The next model training run reflects the withdrawal

## Benefit flow

If a model trained on community data generates commercial value, the value flows to the community. Users of this framework agree to this constraint as a condition of using community-licensed data. **Enforced by the data license, not the code license.**

## Per-community governance roles

Each community deploying this framework designates:

- **Language Authority** — community body with final say on what enters training and what stays restricted
- **Speaker Council** — speakers themselves, who hold consent and can revoke it
- **Technical Steward** — community-trusted operator of the data and model infrastructure

> [!TODO] Sketch minimal protocols for each role's authority and rotation. Open question: how is dispute between roles resolved?

## What we will not do, ever

- Aggregate multiple communities' data into one "pan-Indigenous" model
- Publish unrestricted corpora on third-party hubs (HuggingFace, Kaggle, etc.)
- Train on restricted content under any circumstance
- Use a speaker's voice in contexts beyond what they consented to
- Strip attribution to make a voice "generic"

## References

- FNIGC, *The First Nations Principles of OCAP®* — https://fnigc.ca/ocap-training/
- GIDA, *CARE Principles for Indigenous Data Governance* — https://www.gida-global.org/care
- Te Hiku Media, *Kaitiakitanga License* — https://github.com/TeHikuMedia/Kaitiakitanga-License
- Local Contexts, *Traditional Knowledge & Biocultural Labels* — https://localcontexts.org/labels/traditional-knowledge-labels/
- Mahelona, Duncan, Mainzer, Jones — *"OpenAI's Whisper is another case study in Colonisation"* (2023)

> [!TODO] Annotate each reference with the specific principle it informs in this doc.
