import { chromium } from "playwright";
const BASE = "https://blobex-web.vercel.app";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.goto(BASE + "/", { waitUntil: "networkidle" }); await p.waitForTimeout(2000);

// comparison state 3
const c = p.locator("#comparison");
await c.scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
await c.getByRole("button",{name:/What we propose/}).click(); await p.waitForTimeout(1500);
console.log("YOUR SYSTEM count:", await c.getByText("YOUR SYSTEM").count());
console.log("core text present:", await c.locator("text=/YOUR SYSTEM/i").count());
console.log("sample centre html:", (await c.innerHTML()).match(/YOUR SYSTEM[\s\S]{0,80}/)?.[0] ?? "NOT FOUND");

// sectors
const s = p.locator("#sectors");
await s.scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
const optCount = await s.getByRole("option").count();
console.log("sector options:", optCount);
await s.getByRole("option",{name:"Healthcare"}).click(); await p.waitForTimeout(1000);
const txt = await s.innerText();
console.log("healthcare module sample:", txt.split("\n").filter(l=>/intake|Patient|Scheduling/i.test(l)).slice(0,4));
console.log("visible module rows:", (await s.locator("div,li").filter({hasText:"Patient"}).count()));
await b.close();
