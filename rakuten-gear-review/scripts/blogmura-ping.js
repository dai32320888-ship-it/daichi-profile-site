#!/usr/bin/env node
/** デプロイ後にブログ村へ Ping 送信（静的サイト用） */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const promoPath = path.join(root, "data", "promotion.json");
const BLOG_URL = "https://dai32320888-ship-it.github.io/daichi-profile-site/rakuten-gear-review/";
const FEED_URL = `${BLOG_URL}feed.xml`;
const BLOG_TITLE = "元自衛官の楽天装備レビュー";

function loadPingUrl() {
  if (!fs.existsSync(promoPath)) return "";
  try {
    return JSON.parse(fs.readFileSync(promoPath, "utf8")).blogmura?.pingUrl || "";
  } catch {
    return "";
  }
}

function xmlRpcPingBody(title, blogUrl, feedUrl) {
  return `<?xml version="1.0"?>
<methodCall>
  <methodName>weblogUpdates.extendedPing</methodName>
  <params>
    <param><value><string>${title}</string></value></param>
    <param><value><string>${blogUrl}</string></value></param>
    <param><value><string>${feedUrl}</string></value></param>
  </params>
</methodCall>`;
}

async function pingBlogmura(pingUrl) {
  const res = await fetch(pingUrl, {
    method: "POST",
    headers: { "Content-Type": "text/xml; charset=utf-8", "User-Agent": "rakuten-gear-review-ping/1.0" },
    body: xmlRpcPingBody(BLOG_TITLE, BLOG_URL, FEED_URL)
  });
  const text = await res.text();
  const ok = res.ok && /fault/i.test(text) === false;
  return { ok, status: res.status, snippet: text.slice(0, 120) };
}

async function main() {
  const pingUrl = process.argv[2] || loadPingUrl();
  if (!pingUrl) {
    console.log("blogmura ping: skip (no pingUrl)");
    return;
  }
  try {
    const result = await pingBlogmura(pingUrl);
    console.log(`blogmura ping: ${result.ok ? "OK" : "NG"} (${result.status})`);
    if (!result.ok) console.log(result.snippet);
    process.exit(result.ok ? 0 : 1);
  } catch (err) {
    console.error("blogmura ping failed:", err.message);
    process.exit(1);
  }
}

main();
