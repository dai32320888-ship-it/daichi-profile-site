#!/usr/bin/env node
/** extra-articles.json 内の誤評価1.2を除去し、必要なら rebuild 前に実行 */
const fs = require("fs");
const path = require("path");
const { isValidRating } = require("./lib/rakuten-search");

const extraPath = path.join(__dirname, "..", "data", "extra-articles.json");
const articles = JSON.parse(fs.readFileSync(extraPath, "utf8"));
let fixes = 0;

function cleanText(s) {
  if (typeof s !== "string" || !s.includes("評価1.2")) return s;
  fixes++;
  return s.replace(/\s*\/\s*評価1\.2/g, "");
}

function walk(obj) {
  if (Array.isArray(obj)) return obj.map(walk);
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (k === "rating" && !isValidRating(v)) {
        fixes++;
        continue;
      }
      out[k] = walk(v);
    }
    return out;
  }
  return cleanText(obj);
}

const cleaned = walk(articles);
fs.writeFileSync(extraPath, JSON.stringify(cleaned, null, 2), "utf8");
console.log(`fix-stale-ratings: ${fixes} fixes applied`);
