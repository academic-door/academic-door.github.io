# Homepage Feed Contract (v1.0)

A versioned JSON contract that lets the two literature projects publish a small
daily feed which the homepage consumes, replacing handwritten sample records.

## Transport

- One JSON file per project, published as a static asset (e.g. GitHub Pages).
- The homepage fetches the feed at render time; if the fetch or validation
  fails, the page keeps its built-in fixture content (progressive enhancement,
  never a blank section).
- Prototype fixtures live in `data/fixtures/` and double as the fallback data
  and as documentation-by-example.

## Top-level fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `schema_version` | string | yes | This document describes `"1.0"`. Consumers must reject other major versions. |
| `generated_at` | string (ISO 8601 UTC) | yes | Generation timestamp. |
| `project` | string | yes | `"econ-papers-daily"` or `"nber-working-papers-cn"`. |
| `items` | array | yes | Paper records, pre-filtered by the producer. |

## Item fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Stable unique key. Format: `doi:<lowercased DOI>` for journal papers, `nber:w<number>` for NBER working papers. Consumers deduplicate on this key. |
| `title` | string | yes | Original (usually English) title, untruncated. |
| `title_zh` | string | no | Chinese title if available. |
| `authors` | string[] | no | Author names in source order. |
| `source` | string | yes | Journal or series name, e.g. `"Journal of Development Economics"`, `"NBER Working Paper"`. |
| `date` | string (`YYYY-MM-DD`) | yes | Publication / release date. |
| `url` | string | yes | Canonical reading entrance (project page preferred over publisher page). |
| `research_question_zh` | string | no | One-sentence research question in Chinese. |
| `is_china_related` | boolean | no (default `false`) | `true` only for verified China-related papers. |
| `editorial_tier` | string | no | Source tier from the existing `hourly_crossref_priority` set, e.g. `"TOP"`, `"A+"`. Absent means untiered. |
| `tags` | string[] | no | Topical metadata. |

## Ordering rules (applied by the consumer)

- **China economics stream** (`econ-papers-daily`):
  1. `editorial_tier` priority: `TOP` → `A+` → untiered/other
  2. `date` descending
- **NBER stream** (`nber-working-papers-cn`):
  1. verified `is_china_related` first
  2. NBER number (parsed from `id`) descending
- Deduplication: items sharing a normalized `id` (case-insensitive) keep the
  first occurrence.
- Display cap: at most **3 items per stream**.

Producers may pre-sort, but consumers re-apply the rules so the contract stays
authoritative in one place.

## Long titles

Titles are never truncated in markup or by script. The consumer renders the
full title and applies a CSS multi-line clamp (`-webkit-line-clamp`) for the
visual layout only, so screen readers and find-in-page always see the complete
title.

## Versioning

Breaking changes (removing/renaming fields, changing `id` semantics) bump the
major version and must not reuse `"1.0"`. Additive optional fields may keep
`"1.0"`.
