const fs = require("fs");
const path = require("path");
const { buildBrowserFragments } = require("./rakuten-widgets");

const root = path.resolve(__dirname, "..");
const outPath = path.join(root, "rakuten-widgets-browser.js");
const fragments = buildBrowserFragments(root);

const js = `/* auto-generated — do not edit. Run: node scripts/build-rakuten-widgets-browser.js */
(function () {
  const PLACEMENTS = ${JSON.stringify(fragments, null, 2)};
  window.__rakutenWidgets = {
    enabled: PLACEMENTS.enabled,
    placement(name) {
      return PLACEMENTS[name] || "";
    },
    homeCampaignSection() {
      return PLACEMENTS.homeCampaignSection || "";
    },
    homeMotionSection() {
      return PLACEMENTS.homeMotionSection || "";
    }
  };
})();
`;

fs.writeFileSync(outPath, js, "utf8");
console.log("Wrote", outPath);
