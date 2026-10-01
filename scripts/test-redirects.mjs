/**
 * Taşıma günü testi: eski sitenin her adresini .htaccess kurallarından
 * Apache sırasıyla geçirir ve varılan adresi çalışan yeni sitede çağırır.
 *
 * Kullanım:
 *   1) npm run pack:directadmin
 *   2) cd dist-directadmin/uygulama && PORT=3555 node app.js
 *   3) node scripts/test-redirects.mjs [http://127.0.0.1:3555]
 *
 * Eski adres listesi: scripts/data/eski-site-adresleri.txt (eski site
 * kapandığında da test çalışabilsin diye repoda saklanır).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const BASE = (process.argv[2] ?? "http://127.0.0.1:3555").replace(/\/$/, "");

const oldPaths = readFileSync(resolve(ROOT, "scripts/data/eski-site-adresleri.txt"), "utf8")
  .split("\n").filter(Boolean)
  .map((u) => decodeURIComponent(new URL(u).pathname).replace(/^\/|\/$/g, ""));

const rules = readFileSync(resolve(ROOT, "dist-directadmin/htaccess-kurallari.txt"), "utf8")
  .split("\n")
  .map((l) => l.trim().match(/^RewriteRule\s+(\S+)\s+(\S+)\s+\[R=301,L\]$/))
  .filter((m) => m && m[1] !== "^")
  .map((m) => ({ re: new RegExp(m[1]), to: m[2] }));

const resolvePath = (p) => {
  for (const r of rules) if (r.re.test(p)) return { to: r.to, redirected: true };
  return { to: `/${p}`, redirected: false };
};

const targets = new Map(oldPaths.map((p) => [p, resolvePath(p)]));
const uniq = [...new Set([...targets.values()].map((t) => t.to))];
const status = new Map();
const queue = [...uniq];
await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (queue.length) {
      const t = queue.shift();
      try {
        const res = await fetch(BASE + encodeURI(t), { redirect: "manual" });
        status.set(t, res.status);
      } catch {
        status.set(t, 0);
      }
    }
  }),
);

const bad = [...targets].filter(([, t]) => status.get(t.to) !== 200);
const redirected = [...targets.values()].filter((t) => t.redirected).length;
console.log(`eski adres: ${oldPaths.length} | kurala takilan: ${redirected} | ayni adreste: ${oldPaths.length - redirected}`);
console.log(`SONUC: ${oldPaths.length - bad.length} / ${oldPaths.length} adres 200 ile aciliyor`);
const top = new Map();
for (const t of targets.values()) top.set(t.to, (top.get(t.to) ?? 0) + 1);
console.log("en cok hedeflenen:");
for (const [t, n] of [...top].sort((a, b) => b[1] - a[1]).slice(0, 6)) console.log(`  ${String(n).padStart(4)} -> ${t}  [${status.get(t)}]`);
for (const [p, t] of bad.slice(0, 20)) console.log(`  !! /${p} -> ${t.to} [${status.get(t.to)}]`);
process.exit(bad.length ? 1 : 0);
