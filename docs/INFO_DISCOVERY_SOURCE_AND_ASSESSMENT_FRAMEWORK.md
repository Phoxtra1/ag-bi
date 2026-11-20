# Info Discovery: Source, Processing and Assessment Framework

## Purpose

Info Discovery is the self-service information discovery experience within Info Solutions by Amineva Global. It helps users explore topics, examine available evidence, understand context and distinguish established information from claims or unresolved questions.

The four discovery sections are:

- **Discovery** — general information discovery across subjects and sectors.
- **Sensitive** — careful examination of sensitive public-interest subjects using reliable public information and evidence.
- **Classified** — research using declassified records and other lawfully public information about classified subjects.
- **Conspiracy** — structured examination of conspiracy claims, their origins, supporting material, counter-evidence and the current state of knowledge.

The short descriptions shown in the interface explain each section. They do not imply that every section already has a fully connected automated source or search engine.

## 1. Source discovery: where information comes from

### 1.1 Source register first

Do not begin by bulk-importing thousands of documents. Start with a maintained source register. Each source entry should record:

- Source or institution name.
- Official website or repository address.
- Source type: government archive, public authority, academic institution, research publisher, court or inquiry, international organisation, established media, or other.
- Geographic or subject coverage.
- Available access method: search page, catalogue, API, RSS/feed, downloadable records or manual review.
- Terms of use, copyright and reuse restrictions.
- Last checked date.
- Source reliability notes and known limitations.

Prioritise original records and primary sources. Secondary reporting can provide context and help locate original material, but must not be represented as the original record.

### 1.2 Initial source families

Begin with a small, curated set and expand only after testing source quality and access conditions.

**Official archives and declassification collections**
- US National Archives and Records Administration (NARA) and its Catalog.
- CIA FOIA Electronic Reading Room.
- FBI Vault.
- UK National Archives and its Discovery catalogue.
- Publicly released records from national defence, foreign affairs and intelligence-history archives where lawful access is provided.
- Official government inquiry, commission and parliamentary record repositories.

**International and public institutions**
- United Nations Digital Library and official UN document repositories.
- Public records and publications from recognised intergovernmental organisations.
- National libraries, university repositories and public research archives.

**Academic and scientific sources**
- Peer-reviewed journals and their official repositories.
- University research repositories.
- Public scholarly indexes and research databases.
- Published datasets with clear provenance and reuse terms.

**Public-interest and investigative material**
- Court judgments, regulatory decisions and official investigation reports.
- Public company and charity registries.
- Credible investigative reporting, used with attribution and corroboration.

This is an initial source map, not an assertion that every source is already integrated. Source access, indexing rights and technical availability must be checked individually before implementation.

### 1.3 Classified-section boundary

The Classified section must focus on:

- Documents formally declassified and lawfully released.
- Historical intelligence, military, diplomatic and security records available through official public archives.
- Official inquiries and reports that discuss classified subjects and have been released for public access.
- Reliable public reporting about ongoing or recent security matters, limited to information already lawfully published by credible sources.

It must not seek, acquire, publish or facilitate access to information that remains lawfully restricted. Do not use stolen documents, hacked systems, leaked credentials, unauthorised access, or instructions for bypassing access controls. Do not expose operational details, vulnerabilities, identities, locations or tactical information where publication could create a foreseeable security or personal-safety risk.

A document described online as “leaked” or “classified” is not automatically authentic, lawful to republish or suitable for the platform. Treat its provenance and legal status as unresolved unless authoritative evidence establishes otherwise. Where a document's release status cannot be established, do not label it declassified.

## 2. Information processing: from source to reviewed item

Use a controlled pipeline:

1. **Discover** — identify a candidate item through the source register, archive catalogue, approved feed or manual research.
2. **Acquire** — access only material that is lawfully public and permitted under the source's terms. Preserve the original source reference.
3. **Register** — record title, issuing body, original URL or archive identifier, document date, release/publication date, date accessed, jurisdiction, file type and source type.
4. **Extract** — obtain searchable text from HTML, PDF or other permitted formats. Use OCR for scans and retain the original document reference.
5. **Check integrity and duplicates** — retain file hashes where appropriate, detect duplicate or revised copies, and distinguish an original from a mirror or excerpt.
6. **Classify** — assign one of the four discovery sections and relevant subject tags. Record why the item belongs there.
7. **Assess** — examine provenance, source authority, completeness, corroboration, context, possible conflicts and limitations.
8. **Review** — require human review before publishing Sensitive, Classified or Conspiracy material. Escalate legal, privacy, safety or uncertain declassification questions.
9. **Publish or withhold** — publish only when source, rights, safety and assessment checks are satisfied. Record the reason when an item is withheld or needs further review.
10. **Monitor** — revisit important records when new official releases, corrections or credible contradictory evidence appear.

Automation may assist with discovery, metadata extraction, OCR, duplicate detection, topic classification and draft summaries. It must not make the final determination that a contested claim is true, a document is authentic, or a record is officially declassified without adequate evidence and review.

## 3. Common information assessment standard

Apply the same assessment framework to items in all four sections. The depth of review may vary by risk, but the core fields remain consistent.

### Required record fields

- **Title and subject:** What is the item or claim about?
- **Section:** Discovery, Sensitive, Classified or Conspiracy.
- **Original source:** Issuing institution, author or originator.
- **Source link or archive identifier:** A route to the original item wherever possible.
- **Document/publication date:** When the item was created or released.
- **Date accessed:** When the platform reviewed it.
- **Source type:** Primary record, official statement, academic study, secondary reporting, witness account, dataset or other.
- **Provenance:** How the item was obtained and whether it is an original, copy, excerpt or reproduction.
- **Evidence summary:** What the source actually establishes.
- **Corroboration:** Whether independent reliable sources support or challenge it.
- **Context:** Relevant background, definitions and chronology.
- **Limitations and uncertainty:** Missing records, incomplete evidence, disputed interpretation or unavailable confirmation.
- **Assessment status:** One of the standard labels below.
- **Review history:** Reviewer, review date and material changes.

### Standard assessment labels

Use labels precisely and explain them:

- **Verified** — the specific fact or record has been checked against an authoritative source or sufficiently strong independent evidence. State exactly what was verified.
- **Corroborated** — supported by multiple credible, sufficiently independent sources, but not necessarily conclusively established.
- **Partially supported** — some elements are supported, while other elements remain unverified or are contradicted.
- **Disputed** — credible sources or evidence materially disagree.
- **Unverified** — available evidence is insufficient to establish the claim or document's authenticity.
- **Contradicted** — reliable evidence conflicts with the specific claim being assessed.
- **Inconclusive** — the available evidence does not support a responsible conclusion.
- **Requires further confirmation** — an authoritative record, issuing institution or additional evidence is needed.

Do not use “Verified” as a blanket label for an entire story when only one detail has been checked. Distinguish document authenticity from the truth of statements contained in the document. A genuine document can contain inaccurate claims.

### Additional Classified metadata

For Classified-section records, separately record:

- Stated classification marking, if visible in the original.
- Declassification or release authority, if known.
- Official release date and archive reference.
- Whether the record is fully released, partially redacted or an official summary.
- Any uncertainty about the record's status.

Never infer declassification solely from a third-party website hosting a copy.

## 4. Information presentation: what the user sees

Present information in a clear, consistent structure:

1. **Overview** — a concise explanation of the subject and the question examined.
2. **Key findings** — the main facts or findings, separated from interpretation.
3. **Evidence and records** — the relevant documents, quotations or data, with links to original sources where available.
4. **Source context** — who produced the material, when and for what purpose.
5. **Corroboration and conflicting evidence** — what other reliable sources support or challenge.
6. **Assessment status** — the applicable label and a short explanation of why it was assigned.
7. **Limitations and unanswered questions** — what cannot currently be established.
8. **Timeline or related records** — when chronology materially helps understanding.
9. **Further reading** — additional primary sources and credible contextual material.

Clearly distinguish source material, factual findings, analysis and unresolved claims. Do not imply that a source has been independently verified when the platform has only located or summarised it. Link to original sources where possible and respect copyright, privacy and source terms. Prefer concise summaries and lawful links over reproducing entire copyrighted documents.

## 5. Section-specific editorial rules

### Discovery
Prioritise useful general information, authoritative sources and clear explanations. Identify the source type and date, and distinguish established information from interpretation.

### Sensitive
Use a public-interest test. Be careful with allegations, personal data, minors, victims, private individuals and ongoing investigations. Attribute allegations, seek corroboration and provide relevant responses or outcomes where available. Do not publish private or identifying details without a lawful and compelling basis.

### Classified
Use declassified records and lawfully public material only. State the release status and archive provenance. Preserve redactions and do not attempt to reconstruct withheld information or expose operationally sensitive details.

### Conspiracy
Describe the claim accurately and identify its origin. Examine the evidence offered for it, independent investigations, credible counter-evidence and the present state of knowledge. Use neutral language. Do not present speculation, correlation, anonymous claims or absence of evidence as proof. Conclusions may be supported, contradicted, disputed or unresolved.

## 6. Implementation sequence

Build this in stages rather than attempting a large-scale collection immediately:

**Stage 1 — Foundation**
- Approve the source register structure and assessment labels.
- Add a small number of high-quality official archives and public research sources.
- Test the full review and presentation process using a limited sample of records.

**Stage 2 — Classified pilot**
- Start with officially declassified historical records from recognised archives.
- Confirm source provenance, release status, document metadata and redactions.
- Require human review before publication.
- Do not enable a broad automated Classified search until the pilot demonstrates reliable results.

**Stage 3 — Sensitive and Conspiracy pilots**
- Test public-interest review, allegation attribution, corroboration and counter-evidence.
- Require editorial review for high-risk material.

**Stage 4 — Controlled automation**
- Add approved feeds, APIs and scheduled catalogue checks where permitted.
- Automate extraction and draft classification, not final verification or publication decisions.
- Monitor source changes, corrections and broken links.

**Stage 5 — Expansion**
- Add sources based on demonstrated user demand, quality, lawful access and operational capacity.
- Measure source coverage, citation quality, correction rates, review time and user-reported issues.

## Operating principle

Info Discovery should help people understand what the available information supports—not simply collect documents or repeat claims. Source transparency, lawful access, evidence quality, context and clearly stated uncertainty are mandatory across all four sections.
