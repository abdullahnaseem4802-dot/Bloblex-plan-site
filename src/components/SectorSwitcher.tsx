"use client";
import { useState } from "react";
import { motion } from "motion/react";
import Reveal from "./Reveal";
import BlobWithAccessory from "./BlobWithAccessory";
import { CONTENT, type Locale } from "@/content/site";
import { SECTORS, SECTOR_UI } from "@/content/sectors";

export default function SectorSwitcher({ locale }: { locale: Locale }) {
  const t = CONTENT[locale].sectors;
  const ui = SECTOR_UI[locale];
  const [active, setActive] = useState(SECTORS[0].id);
  const idx = SECTORS.findIndex((s) => s.id === active);
  const sector = SECTORS[idx] ?? SECTORS[0];
  const cycle = (d: number) => setActive(SECTORS[(idx + d + SECTORS.length) % SECTORS.length].id);
  const mods = sector.modules[locale];
  const yFor = (i: number) => 12 + i * (76 / (mods.length - 1)); // spread module rows 12%..88%

  return (
    <section id="sectors" className="py-20 md:py-28">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl md:text-[2.7rem] font-semibold">{t.title}</h2>
          <p className="mt-5 text-lg text-[var(--color-slate)]">{t.lead}</p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 grid lg:grid-cols-[minmax(0,320px)_1fr] gap-8 items-stretch">
            {/* Picker, the "Choisissez un secteur" menu, with obvious switch controls */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white shadow-[var(--shadow-soft)] overflow-hidden">
              <div className="px-4 py-3 bg-[var(--color-ink)] text-white flex items-center justify-between gap-2">
                <span className="font-semibold">{ui.picker}</span>
                <span className="flex items-center gap-1">
                  <button onClick={() => cycle(-1)} aria-label={ui.prev} className="grid h-7 w-7 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">‹</button>
                  <button onClick={() => cycle(1)} aria-label={ui.next} className="grid h-7 w-7 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">›</button>
                </span>
              </div>
              <ul role="listbox" aria-label={ui.picker} className="p-2">
                {SECTORS.map((s) => {
                  const on = s.id === active;
                  return (
                    <li key={s.id}>
                      <button role="option" aria-selected={on} onClick={() => setActive(s.id)}
                        className={`w-full text-left px-4 py-3 rounded-[var(--radius)] font-medium transition-colors ${on ? "bg-[var(--color-brand-50)] text-[var(--color-brand-700)]" : "text-[var(--color-ink-soft)] hover:bg-[var(--color-panel)]"}`}>
                        <span className="flex items-center justify-between">
                          {s.name[locale]}
                          {on && <span aria-hidden className="text-[var(--color-brand-500)]">→</span>}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Stage, blob visually connected to its system modules */}
            <div className="relative rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-panel-2)] p-6 md:p-8 overflow-hidden">
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(41,171,226,.14),transparent_65%)]" />
              <p className="relative text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-mute)] mb-4">
                {ui.connected}, <span className="text-[var(--color-brand-600)]">{sector.name[locale]}</span>
              </p>

              {/* desktop: hub + spokes */}
              <div className="relative hidden md:block h-[360px]">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                  {mods.map((_, i) => (
                    <line key={i} x1="29" y1="50" x2="52" y2={yFor(i)} stroke="var(--color-brand-300)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
                  ))}
                </svg>
                <div className="absolute left-[1%] top-1/2 -translate-y-1/2 w-[210px] h-[176px]">
                  <BlobWithAccessory accessory={sector.accessory} />
                </div>
                {mods.map((m, i) => (
                  <motion.div
                    key={sector.id + m}
                    initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="absolute -translate-y-1/2 flex items-center gap-2.5 rounded-[var(--radius)] border border-[var(--color-line)] bg-white px-3.5 py-2.5 text-sm font-semibold text-[var(--color-ink-soft)] shadow-[var(--shadow-soft)]"
                    style={{ left: "52%", right: "2%", top: `${yFor(i)}%` }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-500)] shrink-0" />{m}
                  </motion.div>
                ))}
              </div>

              {/* mobile: stacked */}
              <div className="md:hidden">
                <div className="mx-auto w-[200px] h-[168px]"><BlobWithAccessory accessory={sector.accessory} /></div>
                <ul className="mt-4 grid grid-cols-1 gap-2.5">
                  {mods.map((m, i) => (
                    <motion.li key={sector.id + m} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="flex items-center gap-2.5 rounded-[var(--radius)] border border-[var(--color-line)] bg-white px-3.5 py-2.5 text-sm font-semibold text-[var(--color-ink-soft)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-500)] shrink-0" />{m}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

        <p className="mt-5 text-sm text-[var(--color-mute)]">↔ {ui.hint}</p>
      </div>
    </section>
  );
}
