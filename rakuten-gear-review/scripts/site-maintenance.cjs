const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const repoRoot = path.resolve(root, "..");
const articleRoot = path.join(root, "article");
const textExtensions = new Set([".html", ".xml", ".js", ".json"]);

const SLUG_RENAMES = {
  "gap-solo-": "gap-solo-一人暮らし-カーテン-丈",
  "gap-car-": "gap-car-車-サングラス-ホルダー",
  "gap-disaster-": "gap-disaster-防災-ラジオ-スマホ充電",
  "gap-training-": "gap-training-腹筋-ローラー-膝当て",
  "gap-pc-ai-PC": "gap-pc-ai-ノートpc-冷却パッド-静音",
  "gap-game-Sw-EL": "gap-game-switch-oled-フィルム",
};

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

function writeIfChanged(file, content) {
  const current = read(file);
  if (current === content) return false;
  fs.writeFileSync(file, content, "utf8");
  return true;
}

function decodeHtmlEntities(text) {
  return String(text || "")
    .replace(/&amp;times;/gi, "×")
    .replace(/&amp;#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;([a-z]+);/gi, (_, name) => {
      const map = { lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
      return map[name.toLowerCase()] ?? `&${name};`;
    })
    .replace(/&amp;/g, "&");
}

function stripTags(value) {
  return decodeHtmlEntities(
    String(value || "")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function cleanProductName(raw) {
  let s = decodeHtmlEntities(raw)
    .replace(/＼新柄登場／/g, "")
    .replace(/\\新柄登場\\/g, "")
    .replace(/楽天1位★[^　\s]*/g, "")
    .replace(/★\d+週連続/g, "")
    .replace(/\[\s*選べる[^\]]*\]/g, "")
    .replace(/\(\s*選べる[^\)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (/^(iPhone|20W|Type|USB|幅\d|丈\d)/i.test(s) && s.length < 40) {
    return s;
  }

  if (s.length > 72) {
    s = s.slice(0, 72).replace(/\s+\S*$/, "").trim() + "…";
  }

  s = s.replace(/(?:Type|USB|幅\d+cm×?|&times;?)$/i, "").trim();
  if (s.endsWith("×")) s = s.slice(0, -1).trim();
  return s || "候補商品";
}

function renameBrokenSlugs() {
  const renamed = [];
  for (const [from, to] of Object.entries(SLUG_RENAMES)) {
    const fromDir = path.join(articleRoot, from);
    const toDir = path.join(articleRoot, to);
    if (!fs.existsSync(fromDir)) continue;
    if (fs.existsSync(toDir)) throw new Error(`Target slug already exists: ${to}`);
    fs.renameSync(fromDir, toDir);
    renamed.push({ from, to });
  }

  if (!renamed.length) return { renamed, filesPatched: 0 };

  const replacements = [];
  for (const { from, to } of renamed) {
    replacements.push(
      [`/article/${from}/`, `/article/${to}/`],
      [`article/${from}/`, `article/${to}/`],
      [`../${from}/`, `../${to}/`],
      [`./article/${from}/`, `./article/${to}/`],
    );
  }

  let filesPatched = 0;
  for (const file of walk(repoRoot, (f) => textExtensions.has(path.extname(f)))) {
    let html = read(file);
    let next = html;
    for (const [from, to] of replacements) {
      next = next.split(from).join(to);
    }
    if (writeIfChanged(file, next)) filesPatched += 1;
  }

  return { renamed, filesPatched };
}

function fixProductNames() {
  let filesChanged = 0;
  let replacements = 0;
  const articleFiles = walk(articleRoot, (f) => f.endsWith("index.html"));

  for (const file of articleFiles) {
    let html = read(file);
    const before = html;

    html = html.replace(/(<(?:h2|td|th)[^>]*>[\s\S]*?|<a[^>]*class="pick-title-link"[^>]*>)([\s\S]*?)(<\/(?:h2|td|th|a)>)/g, (full, open, body, close) => {
      const text = stripTags(body);
      if (!text || text.length < 8) return full;
      if (!/(&amp;|＼新柄|楽天1位★|&times;|Type$|幅100cm)/.test(body) && text.length <= 72) return full;
      const cleaned = cleanProductName(text);
      if (cleaned === text) return full;
      replacements += 1;
      return `${open}${cleaned}${close}`;
    });

    html = html.replace(/(<img\b[^>]*\balt=")([^"]*)(")/g, (full, pre, alt, post) => {
      if (!/(&amp;|＼新柄|楽天1位★|&times;)/.test(alt) && alt.length <= 72) return full;
      const cleaned = cleanProductName(stripTags(alt));
      if (cleaned === alt) return full;
      replacements += 1;
      return `${pre}${cleaned.replace(/"/g, "&quot;")}${post}`;
    });

    html = html.replace(/(\baria-label=")([^"]*)(")/g, (full, pre, label, post) => {
      if (!/(&amp;|＼新柄|楽天1位★|&times;)/.test(label) && label.length <= 72) return full;
      const cleaned = cleanProductName(stripTags(label));
      if (cleaned === label) return full;
      replacements += 1;
      return `${pre}${cleaned.replace(/"/g, "&quot;")}${post}`;
    });

    if (writeIfChanged(file, html)) filesChanged += 1;
  }

  return { filesChanged, replacements };
}

function fixRelatedArticleAlts() {
  let filesChanged = 0;
  let altsFixed = 0;
  const htmlFiles = walk(root, (f) => f.endsWith(".html"));

  for (const file of htmlFiles) {
    let html = read(file);
    let changed = false;

    html = html.replace(/<article class="article-card">([\s\S]*?)<\/article>/g, (block) => {
      const titleMatch =
        block.match(/<h3><a[^>]*class="article-title-link"[^>]*>([\s\S]*?)<\/a><\/h3>/) ||
        block.match(/<h3><a[^>]*>([\s\S]*?)<\/a><\/h3>/);
      if (!titleMatch) return block;

      const title = stripTags(titleMatch[1]);
      const category =
        block.match(/<span class="article-thumb__meta">\s*<span>([^<]+)<\/span>/)?.[1] ||
        block.match(/<span>([^<]+)<\/span>\s*<strong>/)?.[1] ||
        "";
      const expectedAlt = category ? `${title}（${category}）` : title;

      const nextBlock = block.replace(/<img\b([^>]*)\salt="([^"]*)"/, (imgFull, attrs, alt) => {
        if (alt === expectedAlt) return imgFull;
        altsFixed += 1;
        changed = true;
        return `<img${attrs} alt="${expectedAlt.replace(/"/g, "&quot;")}"`;
      });

      return nextBlock;
    });

    if (changed && writeIfChanged(file, html)) filesChanged += 1;
  }

  return { filesChanged, altsFixed };
}

const slugResult = renameBrokenSlugs();
const productResult = fixProductNames();
const altResult = fixRelatedArticleAlts();

console.log(
  JSON.stringify(
    {
      slugResult,
      productResult,
      altResult,
    },
    null,
    2,
  ),
);
