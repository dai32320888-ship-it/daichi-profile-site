/**
 * data/rakuten-widgets-inbox/*.html → data/rakuten-widgets.json の banners.*.html
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const inboxDir = path.join(root, "data", "rakuten-widgets-inbox");
const configPath = path.join(root, "data", "rakuten-widgets.json");
const processedDir = path.join(inboxDir, "processed");

const MAP = {
  "point.html": "point",
  "season.html": "season"
};

function readHtml(filePath) {
  return fs.readFileSync(filePath, "utf8").trim();
}

function main() {
  if (!fs.existsSync(configPath)) {
    console.error("Missing", configPath);
    process.exit(1);
  }
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.banners = config.banners || {};
  let updated = 0;

  if (!fs.existsSync(inboxDir)) {
    fs.mkdirSync(inboxDir, { recursive: true });
    console.log("Created inbox:", inboxDir);
    console.log("Paste point.html / season.html from Rakuten dashboard, then re-run.");
    return;
  }

  for (const [fileName, key] of Object.entries(MAP)) {
    const src = path.join(inboxDir, fileName);
    if (!fs.existsSync(src)) continue;
    const html = readHtml(src);
    if (!html) continue;
    config.banners[key] = config.banners[key] || {};
    config.banners[key].html = html;
    fs.mkdirSync(processedDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    fs.renameSync(src, path.join(processedDir, `${stamp}-${fileName}`));
    updated += 1;
    console.log("Imported banner:", key);
  }

  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  if (!updated) {
    console.log("No inbox files. Add point.html or season.html under", inboxDir);
  } else {
    console.log("Updated", configPath, `(${updated} banner(s))`);
  }
}

main();
