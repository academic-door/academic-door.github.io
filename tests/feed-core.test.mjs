import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  dedupeItems,
  nberNumber,
  prepareStream,
  selectTop,
  sortChinaStream,
  sortNberStream,
  tierRank,
  validateFeed,
} from "../assets/feed-core.mjs";

async function loadFixture(name) {
  const url = new URL(`../data/fixtures/${name}`, import.meta.url);
  return JSON.parse(await readFile(url, "utf8"));
}

test("dedupeItems removes case-insensitive duplicate ids, keeping first", () => {
  const items = [
    { id: "doi:10.1/abc", title: "first" },
    { id: "DOI:10.1/ABC", title: "duplicate" },
    { id: "nber:w1", title: "other" },
  ];
  const result = dedupeItems(items);
  assert.equal(result.length, 2);
  assert.equal(result[0].title, "first");
});

test("tierRank orders TOP before A+ before untiered", () => {
  assert.ok(tierRank("TOP") < tierRank("A+"));
  assert.ok(tierRank("A+") < tierRank(undefined));
  assert.ok(tierRank("A+") < tierRank("B"));
});

test("sortChinaStream: tier priority beats recency", () => {
  const items = [
    { id: "a", title: "untier-newest", date: "2026-07-17" },
    { id: "b", title: "aplus-older", date: "2026-07-11", editorial_tier: "A+" },
    { id: "c", title: "top-old", date: "2026-07-01", editorial_tier: "TOP" },
    { id: "d", title: "top-new", date: "2026-07-16", editorial_tier: "TOP" },
  ];
  const titles = sortChinaStream(items).map((item) => item.title);
  assert.deepEqual(titles, ["top-new", "top-old", "aplus-older", "untier-newest"]);
});

test("sortNberStream: verified China-related first, then number desc", () => {
  const items = [
    { id: "nber:w35470", title: "non-china-high", is_china_related: false },
    { id: "nber:w35449", title: "china-low", is_china_related: true },
    { id: "nber:w35453", title: "china-high", is_china_related: true },
    { id: "nber:w35468", title: "non-china-low", is_china_related: false },
  ];
  const titles = sortNberStream(items).map((item) => item.title);
  assert.deepEqual(titles, ["china-high", "china-low", "non-china-high", "non-china-low"]);
});

test("nberNumber parses ids and rejects malformed ones", () => {
  assert.equal(nberNumber("nber:w35468"), 35468);
  assert.equal(nberNumber("NBER:W35453"), 35453);
  assert.equal(nberNumber("doi:10.1/abc"), null);
});

test("selectTop caps at three by default", () => {
  assert.equal(selectTop([1, 2, 3, 4, 5]).length, 3);
});

test("validateFeed rejects wrong schema_version and missing fields", () => {
  const bad = validateFeed({ schema_version: "2.0", project: "x", generated_at: "nope", items: [{}] });
  assert.equal(bad.ok, false);
  assert.ok(bad.errors.some((e) => e.includes("schema_version")));
  assert.ok(bad.errors.some((e) => e.includes("items[0].id")));
});

test("econ fixture: dedupes to 4, top tier first, cap 3", async () => {
  const feed = await loadFixture("econ-papers-daily.feed.json");
  assert.equal(dedupeItems(feed.items).length, 4);
  const stream = prepareStream(feed, "china");
  assert.equal(stream.length, 3);
  assert.deepEqual(
    stream.map((item) => item.editorial_tier ?? null),
    ["TOP", "TOP", "A+"],
  );
  assert.equal(stream[0].date, "2026-07-16");
});

test("nber fixture: china-related lead despite higher non-china number", async () => {
  const feed = await loadFixture("nber-working-papers-cn.feed.json");
  const stream = prepareStream(feed, "nber");
  assert.equal(stream.length, 3);
  assert.deepEqual(
    stream.map((item) => item.id),
    ["nber:w35453", "nber:w35449", "nber:w35470"],
  );
});

test("prepareStream throws on invalid feed", () => {
  assert.throws(() => prepareStream({ schema_version: "0.9" }, "china"));
});
