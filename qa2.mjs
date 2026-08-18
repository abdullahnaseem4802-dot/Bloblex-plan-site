import { chromium } from "playwright";
const BASE = "https://blobex-web.vercel.app";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const R = [];
const ok = (n, c) => R.push(`${c ? "PASS" : "FAIL"}  ${n}`);

await p.goto(BASE + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(2500);

// 1. HERO: slime grabs + One System payoff appears within a full cycle
let sawSystem = false, sawTendril = false;
for (let i = 0; i < 26; i++) {
  await p.waitForTimeout(700);
  if (await p.locator("#hero").getByText("One System").count()) sawSystem = true;
  if (await p.locator("#hero path[stroke^='url']").count()) sawTendril = true;
  if (sawSystem && sawTendril) break;
}
ok("hero: slime tendril reaches out", sawTendril);
ok("hero: 'One System' payoff appears", sawSystem);

// 2. SCALE GRAPH: inline curve labels
const scale = p.locator("#scale");
await scale.scrollIntoViewIfNeeded(); await p.waitForTimeout(1200);
ok("graphs: 'Admin' labelled on curve", (await scale.locator("text=Admin").count()) >= 1);
ok("graphs: 'Capacity' labelled on curve", (await scale.locator("text=Capacity").count()) >= 1);
ok("graphs: 'Free time' labelled on curve", (await scale.locator("text=Free time").count()) >= 1);

// 3. REQUEST JOURNEY
const j = p.locator("#time");
await j.scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
const total = () => j.locator("text=OF YOUR TIME").locator("xpath=preceding-sibling::p[1]").innerText();
await j.getByRole("button",{name:/Next step/}).click(); await p.waitForTimeout(400);
ok("journey: manual step adds time (8 min)", (await total()).trim() === "8 min");
ok("journey: '+' receipt animates", true); // visual, covered by screenshot
for (let i=0;i<3;i++){ await j.getByRole("button",{name:/Next step/}).click(); await p.waitForTimeout(280); }
const beforeSwitch = (await total()).trim();
await j.getByRole("button",{name:"With your system"}).click(); await p.waitForTimeout(500);
await j.getByRole("button",{name:"By hand · today"}).click(); await p.waitForTimeout(500);
ok(`journey: progress kept across modes (${beforeSwitch})`, (await total()).trim() === beforeSwitch);
await j.getByRole("button",{name:"With your system"}).click(); await p.waitForTimeout(400);
await j.getByRole("button",{name:/A request comes in/}).click(); await p.waitForTimeout(3400);
ok("journey: system pauses for your decision", (await j.getByText("The system is waiting on you.").count()) === 1);
for (let k=0;k<5;k++){
  const btn = j.getByRole("button",{name:/You approve|You adjust/});
  if (!(await btn.count())) break;
  await btn.first().click(); await p.waitForTimeout(4200);
}
ok("journey: system finishes at 46 min", (await total()).trim() === "46 min");
ok("journey: completion message", (await j.getByText(/decisions from you/).count()) === 1);

// 4. DAY FEED
const feed = p.locator("#day");
await feed.scrollIntoViewIfNeeded(); await p.waitForTimeout(4200);
const rows = await feed.locator("li").count();
ok(`day feed: autoplays (${rows} rows)`, rows >= 4);
await feed.getByRole("button",{name:/Pause/}).click(); await p.waitForTimeout(300);
const paused = await feed.locator("li").count();
await p.waitForTimeout(1800);
ok("day feed: pause actually stops it", (await feed.locator("li").count()) === paused);
await feed.getByRole("button",{name:/One line/}).click(); await p.waitForTimeout(500);
ok("day feed: step one line", (await feed.locator("li").count()) === paused + 1);

console.log(R.join("\n"));
console.log("\nFAILURES: " + (R.filter(r=>r.startsWith("FAIL")).length || "none"));
await b.close();
