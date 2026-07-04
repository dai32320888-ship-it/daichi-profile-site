#!/usr/bin/env node
/**
 * Weekly read-only health check for verify-root-work.
 * Does not modify files, commit, or push.
 */
const { execSync, spawnSync } = require("child_process");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const STATIC_AUDIT = path.join(repoRoot, "rakuten-gear-review", "scripts", "audit-static-site.cjs");
const IMAGE_AUDIT = path.join(repoRoot, "rakuten-gear-review", "scripts", "audit-image-assets.cjs");
const SITEMAP_CHECK = path.join(repoRoot, "scripts", "sync-root-sitemap.cjs");

const markdown = process.argv.includes("--markdown");
const skipGit = process.argv.includes("--skip-git") || process.env.CI === "true";

function runNode(script, args = []) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
  return {
    stdout: (result.stdout || "").trim(),
    stderr: (result.stderr || "").trim(),
    exitCode: result.status ?? 1,
  };
}

function parseJson(stdout) {
  try {
    return JSON.parse(stdout);
  } catch {
    return null;
  }
}

function checkGit() {
  if (skipGit) {
    return { skipped: true, clean: true, branch: "", dirtyFiles: [] };
  }
  const branch = execSync("git status -sb", { cwd: repoRoot, encoding: "utf8" }).trim();
  const porcelain = execSync("git status --porcelain", { cwd: repoRoot, encoding: "utf8" }).trim();
  const dirtyFiles = porcelain ? porcelain.split("\n").filter(Boolean) : [];
  return { skipped: false, clean: dirtyFiles.length === 0, branch, dirtyFiles };
}

function classify({ git, staticAudit, imageAudit, sitemap, staticExit, imageExit, sitemapExit }) {
  const ok = [];
  const warnings = [];
  const problems = [];

  if (git.skipped) ok.push("git（CI のためスキップ）");
  else if (git.clean) ok.push("git working tree clean");
  else problems.push(`working tree が clean ではない（${git.dirtyFiles.length} 件）`);

  if (staticExit === 0 && staticAudit) {
    ok.push("static audit");
    if (staticAudit.warnings?.length) {
      for (const w of staticAudit.warnings) warnings.push(`static: ${w}`);
    }
  } else {
    problems.push("static audit 失敗");
    if (staticAudit?.errors?.length) {
      for (const e of staticAudit.errors.slice(0, 10)) problems.push(`static: ${e}`);
    }
  }

  if (imageExit === 0 && imageAudit) {
    const imageIssues =
      (imageAudit.localMissing?.length || 0) +
      (imageAudit.missingContentFallback?.length || 0) +
      (imageAudit.badExternal?.length || 0);
    if (imageIssues === 0) ok.push("image audit");
    else problems.push(`image audit: ${imageIssues} 件の問題`);
  } else {
    problems.push("image audit 失敗");
  }

  if (sitemapExit === 0 && sitemap?.match) {
    ok.push("sitemap 整合");
  } else if (sitemap && sitemap.countDiff <= 2 && sitemap.missingInRoot?.length <= 2) {
    warnings.push(`sitemap 軽微な不一致（差 ${sitemap.countDiff}）`);
  } else {
    problems.push("sitemap 不一致");
    if (sitemap?.missingInRoot?.length) {
      problems.push(`sitemap 欠落: ${sitemap.missingInRoot.slice(0, 5).join(", ")}`);
    }
  }

  if (staticAudit?.brokenSlugs?.length) {
    problems.push(`broken slug: ${staticAudit.brokenSlugs.join(", ")}`);
  }
  if (staticAudit?.legacySlugRefCount > 0) {
    problems.push(`legacy slug 参照: ${staticAudit.legacySlugRefCount}`);
  }
  if (staticAudit?.links?.badCount > 0) {
    problems.push(`リンク切れ: ${staticAudit.links.badCount}`);
  }
  if (staticAudit?.affiliateDisclosure?.missing?.length) {
    problems.push(`PR表記欠落: ${staticAudit.affiliateDisclosure.missing.length}`);
  }
  if (staticAudit && !staticAudit.latestDatesNewestFirst) {
    problems.push("新着順が降順ではない");
  }
  if (staticAudit?.feed && !staticAudit.feed.feedMatchesIndexTop5) {
    warnings.push("feed 上位5件が index と不一致");
  }
  if (staticAudit?.giftFeed && !staticAudit.giftFeed.exists) {
    warnings.push("gift-for-you/feed.xml なし");
  }

  const overall = problems.length ? "問題あり" : warnings.length ? "警告" : "OK";
  return { ok, warnings, problems, overall };
}

function remediation(problems, warnings) {
  const tips = [];
  if (problems.some((p) => p.includes("working tree"))) {
    tips.push("git: 変更内容を確認し、意図しない変更は revert / stash");
  }
  if (problems.some((p) => p.startsWith("static") || p.includes("slug") || p.includes("リンク"))) {
    tips.push(
      "静的問題: `node rakuten-gear-review/scripts/repair-static-site.cjs` または個別 HTML 修正（要許可）",
    );
  }
  if (problems.some((p) => p.includes("sitemap"))) {
    tips.push("sitemap: `node scripts/sync-root-sitemap.cjs`（書き込みあり・要許可）");
  }
  if (problems.some((p) => p.includes("image"))) {
    tips.push("画像: パス修正またはアセット追加（要許可）");
  }
  if (warnings.some((w) => w.includes("feed"))) {
    tips.push("feed 順序: repair-static-site の feed-order 処理（要許可）");
  }
  if (!tips.length) tips.push("現時点で修正不要");
  return tips;
}

function formatMarkdown(report) {
  const lines = [];
  lines.push(`# 週次ヘルスチェック — ${report.overall}`);
  lines.push("");
  lines.push(`実行: ${report.timestamp}`);
  lines.push("");
  lines.push("## サマリー");
  lines.push(`- **OK**: ${report.classification.ok.length} 項目`);
  lines.push(`- **警告**: ${report.classification.warnings.length} 件`);
  lines.push(`- **問題あり**: ${report.classification.problems.length} 件`);
  lines.push("");
  if (report.classification.ok.length) {
    lines.push("### OK");
    for (const item of report.classification.ok) lines.push(`- ${item}`);
    lines.push("");
  }
  if (report.classification.warnings.length) {
    lines.push("### 警告");
    for (const item of report.classification.warnings) lines.push(`- ${item}`);
    lines.push("");
  }
  if (report.classification.problems.length) {
    lines.push("### 問題あり");
    for (const item of report.classification.problems) lines.push(`- ${item}`);
    lines.push("");
  }
  lines.push("## 詳細");
  lines.push("");
  lines.push("### git");
  if (report.git.skipped) lines.push("- CI 環境のためスキップ");
  else lines.push(`- \`${report.git.branch}\``);
  lines.push(`- clean: ${report.git.clean}`);
  lines.push("");
  lines.push("### sitemap");
  if (report.sitemap) {
    lines.push(`- rakuten: ${report.sitemap.rakutenCount}`);
    lines.push(`- gift: ${report.sitemap.giftCount}`);
    lines.push(`- root: ${report.sitemap.rootCount}（期待 ${report.sitemap.expectedCount}）`);
    lines.push(`- 一致: ${report.sitemap.match}`);
  }
  lines.push("");
  lines.push("### feed");
  if (report.staticAudit?.feed) {
    lines.push(`- rakuten: ${report.staticAudit.feed.feedItems} 件`);
    lines.push(`- index 一致: ${report.staticAudit.feed.feedMatchesIndexTop5}`);
  }
  if (report.staticAudit?.giftFeed) {
    lines.push(
      `- gift: ${report.staticAudit.giftFeed.items} 件（exists: ${report.staticAudit.giftFeed.exists}）`,
    );
  }
  lines.push("");
  lines.push("## 修正方針（実行しない）");
  for (const tip of report.remediation) lines.push(`- ${tip}`);
  return lines.join("\n");
}

function main() {
  const git = checkGit();
  if (!git.skipped && !git.clean) {
    const early = {
      timestamp: new Date().toISOString(),
      stopped: true,
      reason: "working tree not clean",
      git,
      dirtyFiles: git.dirtyFiles,
    };
    if (markdown) {
      console.log(
        `# 週次ヘルスチェック — 停止\n\nworking tree が clean ではありません。\n\n${git.dirtyFiles.map((f) => `- \`${f}\``).join("\n")}`,
      );
    } else {
      console.log(JSON.stringify(early, null, 2));
    }
    process.exitCode = 1;
    return;
  }

  const staticRun = runNode(STATIC_AUDIT);
  const imageRun = runNode(IMAGE_AUDIT);
  const sitemapRun = runNode(SITEMAP_CHECK, ["--check"]);

  const staticAudit = parseJson(staticRun.stdout);
  const imageAudit = parseJson(imageRun.stdout);
  const sitemap = parseJson(sitemapRun.stdout);

  const classification = classify({
    git,
    staticAudit,
    imageAudit,
    sitemap,
    staticExit: staticRun.exitCode,
    imageExit: imageRun.exitCode,
    sitemapExit: sitemapRun.exitCode,
  });

  const report = {
    timestamp: new Date().toISOString(),
    overall: classification.overall,
    classification,
    git,
    staticAudit,
    imageAudit,
    sitemap,
    remediation: remediation(classification.problems, classification.warnings),
    exits: {
      static: staticRun.exitCode,
      image: imageRun.exitCode,
      sitemap: sitemapRun.exitCode,
    },
  };

  if (markdown) {
    console.log(formatMarkdown(report));
  } else {
    console.log(JSON.stringify(report, null, 2));
  }

  if (classification.overall === "問題あり") process.exitCode = 1;
  else if (classification.overall === "警告") process.exitCode = 2;
}

main();
