import { readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";

// 构建前生成内容清单（Workers 运行时 fs.readdirSync 不可用，listing 页靠本清单渲染）
const CONTENT = "content";
const fileNameToSlug = (f) =>
  f.replace(/\.mdx$/, "").replace(/[^a-zA-Z0-9\-_]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

const manifest = {};
for (const locale of readdirSync(CONTENT)) {
  const localeDir = join(CONTENT, locale);
  try {
    if (!statSync(localeDir).isDirectory()) continue;
  } catch {
    continue;
  }
  manifest[locale] = {};
  for (const ct of readdirSync(localeDir)) {
    const ctDir = join(localeDir, ct);
    try {
      if (!statSync(ctDir).isDirectory()) continue;
    } catch {
      continue;
    }
    manifest[locale][ct] = readdirSync(ctDir)
      .filter((f) => f.endsWith(".mdx"))
      .map(fileNameToSlug);
  }
}
writeFileSync("content-manifest.json", JSON.stringify(manifest, null, 1));
console.log("content-manifest.json generated:", Object.keys(manifest).length, "locales");
