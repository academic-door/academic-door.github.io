/**
 * feed-consumer.js — progressive enhancement for Concept A research streams.
 *
 * Sections opt in via:
 *   <section data-feed-stream="china|nber" data-feed-src="…feed.json">
 *
 * On success the static fixture rows inside the section are replaced with
 * rows rendered from the feed. On any failure (network, HTTP, JSON parse,
 * schema validation) the static markup is left untouched, so the page never
 * loses content when a feed is unavailable.
 */
import { prepareStream } from "./feed-core.mjs";

const MONTH_DAY = /^\d{4}-(\d{2})-(\d{2})$/;

function shortDate(date) {
  const match = MONTH_DAY.exec(String(date || ""));
  return match ? `${match[1]}.${match[2]}` : String(date || "");
}

function sourceLine(item, kind) {
  const parts = [];
  if (kind === "nber") {
    const idPart = String(item.id || "").replace(/^nber:/i, "").toUpperCase();
    parts.push(`NBER ${idPart}`);
  } else {
    parts.push(String(item.source || "").toUpperCase());
  }
  parts.push(shortDate(item.date));
  if (item.is_china_related) parts.push("中国相关");
  return parts.join(" · ");
}

function renderRow(item, index, kind) {
  const article = document.createElement("article");
  article.className = "paper-row";

  const number = document.createElement("span");
  number.textContent = String(index + 1).padStart(2, "0");

  const body = document.createElement("div");

  const source = document.createElement("p");
  source.className = "paper-source";
  source.textContent = sourceLine(item, kind);

  const title = document.createElement("h4");
  title.className = "feed-title";
  title.lang = "en";
  title.textContent = item.title;

  const question = document.createElement("p");
  question.textContent = item.research_question_zh || "";

  body.append(source, title);
  if (item.research_question_zh) body.append(question);
  article.append(number, body);
  return article;
}

async function hydrateSection(section) {
  const kind = section.dataset.feedStream;
  const src = section.dataset.feedSrc;
  if (!kind || !src) return;

  try {
    const response = await fetch(src, { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const feed = await response.json();
    const items = prepareStream(feed, kind, 3);
    if (items.length === 0) return; // keep static fallback

    section.querySelectorAll("article.paper-row").forEach((row) => row.remove());
    const fragment = document.createDocumentFragment();
    items.forEach((item, index) => fragment.append(renderRow(item, index, kind)));
    section.append(fragment);
    section.setAttribute("data-feed-state", "live");
  } catch (error) {
    // Fallback: leave static fixture rows in place.
    section.setAttribute("data-feed-state", "fallback");
    console.warn(`[feed] ${kind}: ${error.message}`);
  }
}

document
  .querySelectorAll("[data-feed-stream][data-feed-src]")
  .forEach((section) => hydrateSection(section));
