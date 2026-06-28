const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const ARTICLE_FETCH_LIMIT = Number(process.env.IMAGE_AUDIT_LIMIT || 0);
const REQUEST_TIMEOUT_MS = Number(process.env.IMAGE_AUDIT_TIMEOUT_MS || 8000);
const SHOULD_FETCH_EXTERNAL = process.env.IMAGE_AUDIT_FETCH === "1";

function walk(dir, predicate, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, out);
    else if (!predicate || predicate(full)) out.push(full);
  }
  return out;
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function decodeHtmlUrl(value) {
  return String(value || "")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .trim();
}

function addUrl(map, url, source) {
  const clean = decodeHtmlUrl(url);
  if (!clean) return;
  if (!map.has(clean)) map.set(clean, new Set());
  map.get(clean).add(source);
}

function collectHtmlImages() {
  const urls = new Map();
  const htmlFiles = walk(root, (file) => file.endsWith(".html"));
  for (const file of htmlFiles) {
    const rel = path.relative(root, file);
    const html = read(file);
    for (const match of html.matchAll(/<img\b[^>]*\bsrc="([^"]*)"/g)) {
      addUrl(urls, match[1], `${rel}:img`);
    }
    for (const match of html.matchAll(/<meta\s+property="og:image"\s+content="([^"]*)"/g)) {
      addUrl(urls, match[1], `${rel}:og:image`);
    }
    for (const match of html.matchAll(/<meta\s+name="twitter:image"\s+content="([^"]*)"/g)) {
      addUrl(urls, match[1], `${rel}:twitter:image`);
    }
  }
  return urls;
}

function auditContentImageFallbacks() {
  const missing = [];
  const htmlFiles = walk(root, (file) => file.endsWith(".html"));
  for (const file of htmlFiles) {
    const rel = path.relative(root, file);
    const html = read(file);
    for (const match of html.matchAll(/<img\b[^>]*>/g)) {
      const tag = match[0];
      const context = html.slice(Math.max(0, match.index - 700), match.index);
      const isContentImage =
        /class="[^"]*\barticle-thumb\b[^"]*"/.test(context) ||
        /class="[^"]*\bproduct-media\b[^"]*"/.test(context);
      if (!isContentImage) continue;
      if (!/\sdata-fallback=/.test(tag) || !/\sonerror=/.test(tag)) {
        const alt = tag.match(/\salt="([^"]*)"/)?.[1] || "";
        missing.push({ file: rel, alt });
      }
    }
  }
  return missing;
}

function collectDataImages() {
  const urls = new Map();
  const dataFiles = [
    path.join(root, "data", "extra-articles.json"),
    path.join(root, "data", "site-strategy.json")
  ].filter(fs.existsSync);
  for (const file of dataFiles) {
    const rel = path.relative(root, file);
    const json = JSON.parse(read(file));
    const visit = (value, pointer = "$") => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => visit(item, `${pointer}[${index}]`));
        return;
      }
      if (!value || typeof value !== "object") return;
      for (const [key, item] of Object.entries(value)) {
        if (typeof item === "string" && /image/i.test(key)) {
          addUrl(urls, item, `${rel}:${pointer}.${key}`);
        } else {
          visit(item, `${pointer}.${key}`);
        }
      }
    };
    visit(json);
  }
  return urls;
}

function mergeMaps(...maps) {
  const merged = new Map();
  for (const map of maps) {
    for (const [url, sources] of map.entries()) {
      if (!merged.has(url)) merged.set(url, new Set());
      for (const source of sources) merged.get(url).add(source);
    }
  }
  return merged;
}

function isLocalUrl(url) {
  return !/^(https?:|data:|mailto:|javascript:|#)/i.test(url);
}

function localTargetExists(url, source) {
  const sourceFile = source.split(":")[0];
  const sourceDir = path.dirname(path.join(root, sourceFile));
  const clean = url.split("#")[0].split("?")[0];
  const target = path.resolve(sourceDir, clean);
  return target.startsWith(root) && fs.existsSync(target);
}

async function fetchImage(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 image-audit",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
      },
      signal: controller.signal
    });
    return {
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get("content-type") || ""
    };
  } catch (error) {
    return { ok: false, status: 0, error: error.name === "AbortError" ? "timeout" : error.message };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const urls = mergeMaps(collectHtmlImages(), collectDataImages());
  const empty = [];
  const localMissing = [];
  const external = [];
  const missingContentFallback = auditContentImageFallbacks();

  for (const [url, sources] of urls.entries()) {
    const sourceList = [...sources];
    if (!url) {
      empty.push({ url, sources: sourceList });
    } else if (isLocalUrl(url)) {
      if (!localTargetExists(url, sourceList[0])) localMissing.push({ url, sources: sourceList });
    } else if (/^https?:/i.test(url)) {
      external.push({ url, sources: sourceList });
    }
  }

  const checked = [];
  const badExternal = [];
  if (SHOULD_FETCH_EXTERNAL) {
    const targets = ARTICLE_FETCH_LIMIT > 0 ? external.slice(0, ARTICLE_FETCH_LIMIT) : external;
    for (const item of targets) {
      const result = await fetchImage(item.url);
      checked.push({ url: item.url, ...result });
      if (!result.ok || (result.contentType && !/image|octet-stream/i.test(result.contentType))) {
        badExternal.push({ ...item, ...result });
      }
    }
  }

  const report = {
    uniqueImages: urls.size,
    externalImages: external.length,
    checkedExternalImages: checked.length,
    empty,
    localMissing,
    missingContentFallback,
    badExternal
  };

  console.log(JSON.stringify(report, null, 2));

  if (empty.length || localMissing.length || missingContentFallback.length || badExternal.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
