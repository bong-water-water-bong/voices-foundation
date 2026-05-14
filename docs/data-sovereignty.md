# Data sovereignty deep dive

## The problem in one paragraph

A non-Indigenous research team records elders, builds a dataset, publishes it on a public hub under an "open" license, gets cited, gets funded. Two years later the language is in someone's commercial product, the community sees none of the value, and elders' voices are being used in ways nobody consented to. **This is the default outcome unless engineered against.**

## How this project engineers against it

### 1. No upstream data hosting
Audio and transcripts live on **community-controlled storage**. The repo holds code and per-community config, not data. Cloning the repo gives you the framework, not the corpus.

### 2. License separation
Code license (MIT/Apache) and data license (community-held) are distinct. The data license never grants redistribution. A downstream user of this framework can run their own corpus through it, but they cannot redistribute the community's data because it was never theirs to begin with.

### 3. Restriction tags are load-bearing
Restricted entries fail closed: if a tag is missing or unverified, the entry **does not** enter training. Implementation:
- Content-addressed corpus (each entry has a hash)
- Per-community signing key held by the Language Authority
- Training pipelines refuse unsigned or unrestricted-tag-missing entries
- Verification is in the training entry point, not opt-in

### 4. Speaker withdrawal must work end-to-end
Not just a contractual promise. Tested operationally:
1. Speaker withdraws consent → corpus entries marked withdrawn
2. Voice embeddings purged from actor registry
3. Composed actors that included this speaker invalidated
4. Next model training run excludes withdrawn material
5. Test suite verifies this on every release

### 5. No aggregation
This framework does not produce a "pan-Indigenous" model. Each community's data trains each community's model. The framework supports federation only at the *tooling* level, never the data level.

### 6. Benefit flow enforced by data license
Code can be MIT. Data cannot. The data license requires that any commercial use yields negotiated benefit-sharing with the community. The framework supports this by making the data license a required field at corpus initialization.

## Reading list

- FNIGC, *The First Nations Principles of OCAP®*
- GIDA, *CARE Principles for Indigenous Data Governance*
- Te Hiku Media, "Papa Reo" and the **Kaitiakitanga License** — closest existing model to what this project needs
- Local Contexts, *Traditional Knowledge & Biocultural Labels*
- Mahelona, Duncan, Mainzer & Jones, *"OpenAI's Whisper is another case study in Colonisation"* (2023) — required reading on what not to do
- *Indigenous Protocol and Artificial Intelligence Position Paper* (Lewis et al., 2020)

> [!TODO] Annotate each entry with the specific principle it informs and add direct links.
