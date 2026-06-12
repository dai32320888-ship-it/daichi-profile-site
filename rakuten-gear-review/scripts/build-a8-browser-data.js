const fs = require("fs");
const path = require("path");
const c = require("./a8-creatives");

const outPath = path.join(__dirname, "..", "a8-browser-data.js");
const reg = c.exportBrowserRegistry();

const banner = `/* auto-generated — do not edit. Run: node scripts/build-a8-browser-data.js */\n`;

const body = `(function () {
  const RAW_FRAGMENTS = ${JSON.stringify(reg.fragments)};
  const midMap = ${JSON.stringify(reg.midMap)};
  const footMap = ${JSON.stringify(reg.footMap)};
  const sidebarMap = ${JSON.stringify(reg.sidebarMap)};
  const homePool = ${JSON.stringify(reg.homePool)};
  const listPool = ${JSON.stringify(reg.listPool)};
  const n = RAW_FRAGMENTS.length;

  function clampIndex(index) {
    const i = Math.floor(Number(index));
    return ((i % n) + n) % n;
  }

  function fallbackIndex(seed) {
    let h = 2166136261 >>> 0;
    const s = String(seed);
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h % n;
  }

  function pickFromPool(pool, seed) {
    if (!pool || pool.length === 0) return 0;
    return clampIndex(pool[fallbackIndex(seed) % pool.length]);
  }

  function midCreativeIndex(articleId) {
    const id = String(articleId);
    return midMap[id] !== undefined ? clampIndex(midMap[id]) : fallbackIndex(\`\${id}:mid\`);
  }

  function footCreativeIndex(articleId) {
    const id = String(articleId);
    const mid = midCreativeIndex(id);
    let v =
      footMap[id] !== undefined ? clampIndex(footMap[id]) : fallbackIndex(\`\${id}:foot\`);
    let guard = 0;
    while (v === mid && guard < n + 2) {
      v = clampIndex(v + 1);
      guard += 1;
    }
    return v;
  }

  function sidebarCreativeIndex(articleId) {
    const id = String(articleId);
    return sidebarMap[id] !== undefined ? clampIndex(sidebarMap[id]) : fallbackIndex(\`\${id}:sidebar\`);
  }

  function sidebarCreativeIndexForList(seed) {
    return pickFromPool(listPool, \`listSidebar:\${seed}\`);
  }

  window.__a8 = {
    RAW_FRAGMENTS,
    midCreativeIndex,
    footCreativeIndex,
    sidebarCreativeIndex,
    sidebarCreativeIndexForList,
    pickCreativeIndexFromPool: pickFromPool,
    fragmentHtml(i) {
      const idx = clampIndex(i);
      return (RAW_FRAGMENTS[idx] || "").trim();
    },
    homeTopPool: homePool,
    midUsesMatsukiyo(articleId) {
      return midCreativeIndex(articleId) === 5;
    }
  };
})();\n`;

fs.writeFileSync(outPath, banner + body, "utf8");
console.log(`Wrote ${path.relative(process.cwd(), outPath)}`);
