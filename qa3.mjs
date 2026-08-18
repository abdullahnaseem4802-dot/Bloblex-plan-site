import { chromium } from "playwright";
const BASE = "https://blobex-web.vercel.app";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const R = []; const ok = (n,c)=>R.push(`${c?"PASS":"FAIL"}  ${n}`);
await p.goto(BASE + "/", { waitUntil: "networkidle" }); await p.waitForTimeout(2000);

// 5. THREE-STATE COMPARISON
const c = p.locator("#comparison");
await c.scrollIntoViewIfNeeded(); await p.waitForTimeout(700);
await c.getByRole("button",{name:/Their solution/}).click(); await p.waitForTimeout(1500);
const tangle = await c.locator("line").count();
ok(`comparison: state 2 draws the tangle (${tangle} lines)`, tangle > 30);
ok("comparison: subscription caption", (await c.getByText(/a subscription, a breaking point/).count()) === 1);
ok("comparison: drawbacks listed", (await c.getByText("One thing breaks, and everything breaks").count()) === 1);
await c.getByRole("button",{name:/What we propose/}).click(); await p.waitForTimeout(1600);
ok("comparison: state 3 core 'YOUR SYSTEM'", (await c.getByText("YOUR SYSTEM").count()) === 1);
ok("comparison: REBUILT · NOT PLUGGED IN badges", (await c.getByText("REBUILT · NOT PLUGGED IN").count()) >= 10);
const spokes = await c.locator("line").count();
ok(`comparison: state 3 spokes (${spokes})`, spokes >= 12 && spokes <= 20);

// 6. SECTOR SWITCHER
const s = p.locator("#sectors");
await s.scrollIntoViewIfNeeded(); await p.waitForTimeout(700);
await s.getByRole("option",{name:"Healthcare"}).click(); await p.waitForTimeout(900);
ok("sectors: switching shows healthcare modules", (await s.getByText("Patient intake").count()) === 1);
await s.getByRole("option",{name:"Logistics"}).click(); await p.waitForTimeout(900);
ok("sectors: switching shows logistics modules", (await s.getByText("Dispatch & routing").count()) === 1);

// 7. AUTOMATION PICKER
const a = p.locator("#automate");
await a.scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
await a.getByRole("button",{name:/Invoicing/}).click(); await p.waitForTimeout(400);
await a.getByRole("button",{name:/Quotes & estimates/}).click(); await p.waitForTimeout(600);
ok("automation picker: hours update (7h/week)", (await a.getByText("7h").count()) >= 1);

// 8. COST RACE
const cr = p.locator("#cost");
await cr.scrollIntoViewIfNeeded(); await p.waitForTimeout(5200);
const punchA = await cr.getByText(/profit the longer it takes/).count();
const punchB = await cr.getByText(/more efficient we are/).count();
ok("cost race: a punchline lands", punchA + punchB >= 1);
ok("cost race: labelled Others / Blobex", (await cr.getByText("Others").count()) >= 1 && (await cr.getByText("Blobex").count()) >= 1);

// 9. SPEED RACE
const sr = p.locator("#speed");
await sr.scrollIntoViewIfNeeded(); await p.waitForTimeout(3000);
ok("speed race: appointment booked", (await sr.getByText("Appointment booked").count()) === 1);
ok("speed race: client talks to your system", (await sr.getByText("is talking to your system").count()) === 1);

// 10. UNCOMPARABLE
const u = p.locator("#uncomparable");
await u.scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
await u.getByRole("button",{name:/Beat my quote/}).click(); await p.waitForTimeout(600);
ok("uncomparable: reveals response", (await u.getByText(/send it through the form/).count()) === 1);

console.log(R.join("\n"));
console.log("\nFAILURES: " + (R.filter(r=>r.startsWith("FAIL")).length || "none"));
await b.close();
