/**
 * feed-core.mjs — pure functions for the homepage feed contract v1.0.
 * Shared by the browser consumer (assets/feed-consumer.js) and the
 * Node test suite (tests/feed-core.test.mjs). No DOM, no fetch.
 */

export const SUPPORTED_SCHEMA_VERSION = "1.0";

const TIER_RANK = { TOP: 0, "A+": 1 };

/** Normalize an item id for deduplication (case-insensitive). */
export function normalizeId(id) {
  return String(id || "").trim().toLowerCase();
}

/** Keep the first occurrence of each normalized id. */
export function dedupeItems(items) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = normalizeId(item.id);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

/** Rank helper: TOP=0, A+=1, everything else 2. */
export function tierRank(tier) {
  return TIER_RANK[String(tier || "").toUpperCase()] ?? 2;
}

/** Parse the working-paper number out of an `nber:wNNNNN` id. */
export function nberNumber(id) {
  const match = /^nber:w?0*(\d+)$/i.exec(String(id || "").trim());
  return match ? Number(match[1]) : null;
}

/** China economics stream: TOP/A+ priority first, then date desc. */
export function sortChinaStream(items) {
  return [...items].sort((a, b) => {
    const tier = tierRank(a.editorial_tier) - tierRank(b.editorial_tier);
    if (tier !== 0) return tier;
    const date = String(b.date || "").localeCompare(String(a.date || ""));
    if (date !== 0) return date;
    return String(a.title || "").localeCompare(String(b.title || ""));
  });
}

/** NBER stream: verified China-related first, then NBER number desc. */
export function sortNberStream(items) {
  return [...items].sort((a, b) => {
    const china = Number(Boolean(b.is_china_related)) - Number(Boolean(a.is_china_related));
    if (china !== 0) return china;
    const numA = nberNumber(a.id);
    const numB = nberNumber(b.id);
    if (numA !== null && numB !== null && numA !== numB) return numB - numA;
    if (numA === null && numB !== null) return 1;
    if (numA !== null && numB === null) return -1;
    return String(b.date || "").localeCompare(String(a.date || ""));
  });
}

/** Display cap. */
export function selectTop(items, limit = 3) {
  return items.slice(0, limit);
}

/**
 * Validate a parsed feed document against contract v1.0.
 * Returns { ok: true, feed } or { ok: false, errors: string[] }.
 */
export function validateFeed(feed) {
  const errors = [];
  if (!feed || typeof feed !== "object") {
    return { ok: false, errors: ["feed is not an object"] };
  }
  if (feed.schema_version !== SUPPORTED_SCHEMA_VERSION) {
    errors.push(`unsupported schema_version: ${feed.schema_version}`);
  }
  if (typeof feed.project !== "string" || feed.project.length === 0) {
    errors.push("missing project");
  }
  if (typeof feed.generated_at !== "string" || Number.isNaN(Date.parse(feed.generated_at))) {
    errors.push("generated_at is not a valid timestamp");
  }
  if (!Array.isArray(feed.items)) {
    errors.push("items is not an array");
  } else {
    feed.items.forEach((item, index) => {
      for (const field of ["id", "title", "source", "date", "url"]) {
        if (typeof item?.[field] !== "string" || item[field].length === 0) {
          errors.push(`items[${index}].${field} missing or empty`);
        }
      }
    });
  }
  return errors.length > 0 ? { ok: false, errors } : { ok: true, feed };
}

/**
 * Full pipeline for one stream: validate → dedupe → sort → cap.
 * `kind` is "china" or "nber". Throws on invalid feed.
 */
export function prepareStream(feed, kind, limit = 3) {
  const check = validateFeed(feed);
  if (!check.ok) {
    throw new Error(`invalid feed: ${check.errors.join("; ")}`);
  }
  const deduped = dedupeItems(feed.items);
  const sorted = kind === "nber" ? sortNberStream(deduped) : sortChinaStream(deduped);
  return selectTop(sorted, limit);
}
