const fs = require("fs");
const path = require("path");

const dataRoot = path.resolve(__dirname, "..", "data");
const replacements = {
  "gap-solo-": "gap-solo-一人暮らし-カーテン-丈",
  "gap-car-": "gap-car-車-サングラス-ホルダー",
  "gap-disaster-": "gap-disaster-防災-ラジオ-スマホ充電",
  "gap-training-": "gap-training-腹筋-ローラー-膝当て",
  "gap-pc-ai-PC": "gap-pc-ai-ノートpc-冷却パッド-静音",
  "gap-game-Sw-EL": "gap-game-switch-oled-フィルム",
};

let filesPatched = 0;
for (const file of fs.readdirSync(dataRoot)) {
  if (!file.endsWith(".json")) continue;
  const full = path.join(dataRoot, file);
  let text = fs.readFileSync(full, "utf8");
  let next = text;
  for (const [from, to] of Object.entries(replacements)) {
    next = next.replaceAll(`"${from}"`, `"${to}"`);
  }
  if (next !== text) {
    fs.writeFileSync(full, next, "utf8");
    filesPatched += 1;
  }
}
console.log(`Patched ${filesPatched} data json files.`);
