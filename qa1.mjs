import { chromium } from "playwright";
const BASE = "https://blobex-web.vercel.app";
const routes = [
  "/", "/what-we-build", "/industries", "/process", "/pricing", "/contact", "/about",
  "/construction-software","/manufacturing-software","/healthcare-software",
  "/professional-services-software","/logistics-software","/distribution-software",
  "/real-estate-software","/hospitality-software","/technology-software",
  "/fr", "/fr/ce-quon-batit", "/fr/secteurs", "/fr/processus", "/fr/tarification",
  "/fr/contact", "/fr/a-propos", "/fr/logiciel-construction", "/fr/logiciel-sante",
  "/robots.txt", "/sitemap.xml",
];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const problems = [];
for (const r of routes) {
  const errs = [];
  const onErr = m => { if (m.type()==="error") errs.push(m.text().slice(0,110)); };
  p.on("console", onErr);
  const onPageErr = e => errs.push("pageerror: "+e.message.slice(0,110));
  p.on("pageerror", onPageErr);
  const resp = await p.goto(BASE + r, { waitUntil: "networkidle" }).catch(e => null);
  await p.waitForTimeout(1200);
  const status = resp ? resp.status() : "FAIL";
  const ov = await p.evaluate(() => ({ s: document.documentElement.scrollWidth, v: document.documentElement.clientWidth })).catch(()=>({s:0,v:0}));
  const overflow = ov.s > ov.v + 1;
  const h1 = await p.locator("h1").count().catch(()=>0);
  const line = `${String(status).padEnd(4)} ${r.padEnd(38)} h1:${h1} ${overflow?"OVERFLOW":"ok"} ${errs.length?"ERR:"+errs[0]:""}`;
  console.log(line);
  if (status !== 200 || overflow || errs.length || (h1 !== 1 && !r.includes(".txt") && !r.includes(".xml"))) problems.push(line);
  p.off("console", onErr); p.off("pageerror", onPageErr);
}
console.log("\n=== PROBLEMS ===");
console.log(problems.length ? problems.join("\n") : "none");
await b.close();
