import { chromium } from "playwright";
const b=await chromium.launch();
const SEL={journey:"#time div.grid-cols-2",compare:"#comparison div.grid-cols-2",day:"#day div.grid-cols-\[1fr_1fr_auto\]"};
for (const [w,h,tag,mob] of [[390,844,"mob",true],[1440,1000,"desk",false]]) {
  const p=await b.newPage({viewport:{width:w,height:h},isMobile:mob});
  await p.goto("http://localhost:3100/",{waitUntil:"networkidle"}); await p.waitForTimeout(2500);
  for (const [name,sel] of Object.entries(SEL)) {
    const el=await p.$(sel);
    if(!el){console.log(`${tag} ${name}: NOT FOUND`);continue;}
    await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(1400);
    const r=await el.evaluate(g=>{const kids=[...g.querySelectorAll("button")];
      const tops=[...new Set(kids.map(k=>Math.round(k.getBoundingClientRect().top)))];
      const gr=g.getBoundingClientRect();
      const flush=tops.every(t=>{const last=kids.filter(k=>Math.round(k.getBoundingClientRect().top)===t).pop();
        return Math.abs(last.getBoundingClientRect().right-(gr.right-parseFloat(getComputedStyle(g).paddingRight)))<5;});
      return {n:kids.length,rows:tops.length,w:kids.map(k=>Math.round(k.getBoundingClientRect().width)),flush};});
    console.log(`${tag} ${name}: rows=${r.rows} widths=${r.w} fillsRow=${r.flush}`);
    await el.screenshot({path:`${tag}-${name}.png`});
  }
  await p.close();
}
await b.close();
