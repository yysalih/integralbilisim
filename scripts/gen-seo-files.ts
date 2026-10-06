/**
 * robots.txt ve security.txt üretir. `npm run build` öncesinde otomatik
 * çalışır (package.json prebuild).
 *
 * sitemap.xml ve llms.txt burada üretilmez: blog yazıları panelden değişeceği
 * için bunlar canlı rotalardır (src/routes/sitemap[.]xml.ts, llms[.]txt.ts).
 * public/ altında aynı adlı bir dosya olursa rotayı gölgeler.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

import { COMPANY } from "../src/lib/company";

const SITE = (process.env.VITE_SITE_URL ?? "https://integralbilisim.com").replace(/\/$/, "");
const PUB = resolve(import.meta.dirname, "..", "public");
mkdirSync(resolve(PUB, ".well-known"), { recursive: true });

// --- robots.txt: AI botlarına açık izin ---
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
  "Bytespider",
  "meta-externalagent",
];

writeFileSync(
  resolve(PUB, "robots.txt"),
  `# ${COMPANY.name} — ${SITE}
User-agent: *
Allow: /

${AI_BOTS.map((bot) => `User-agent: ${bot}\nAllow: /`).join("\n\n")}

Sitemap: ${SITE}/sitemap.xml
`,
);

// --- security.txt ---
const expires = new Date(Date.now() + 365 * 864e5).toISOString().replace(/\.\d+Z$/, "Z");
writeFileSync(
  resolve(PUB, ".well-known", "security.txt"),
  `Contact: mailto:${COMPANY.email}
Expires: ${expires}
Preferred-Languages: tr, en
Canonical: ${SITE}/.well-known/security.txt
`,
);

console.log(`SEO dosyalari yazildi: robots (${AI_BOTS.length} AI botu), security.txt`);
