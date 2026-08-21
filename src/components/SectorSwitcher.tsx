"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Reveal from "./Reveal";
import Parallax from "./Parallax";
import BlobWithAccessory from "./BlobWithAccessory";
import AppIcon, { appForLabel } from "./AppIcon";
import { CONTENT, type Locale } from "@/content/site";
import { SECTORS, SECTOR_UI } from "@/content/sectors";

export default function SectorSwitcher({ locale }: { locale: Locale }) {
  const t = CONTENT[locale].sectors;
  const ui = SECTOR_UI[locale];
  const [active, setActive] = useState(SECTORS[0].id);
  /* Picking a sector used to stop the walk for good. It now only restarts the
     clock, so the visitor gets a full beat on their choice and the section
     keeps moving afterwards. */
  const [beat, setBeat] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const idx = SECTORS.findIndex((s) => s.id === active);

  /* Nobody should have to click to find out what this section does, so it
     walks through the sectors on its own while it is on screen, and stands
     still the moment the visitor chooses one. */
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    let id: ReturnType<typeof setInterval> | null = null;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !id) {
        id = setInterval(() => setActive((cur) => {
          const i = SECTORS.findIndex((x) => x.id === cur);
          return SECTORS[(i + 1) % SECTORS.length].id;
        }), 3600);
      } else if (!e.isIntersecting && id) { clearInterval(id); id = null; }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { if (id) clearInterval(id); io.disconnect(); };
  }, [beat]);
  const sector = SECTORS[idx] ?? SECTORS[0];
  const pick = (id: string) => { setActive(id); setBeat((n) => n + 1); };
  const cycle = (d: number) => pick(SECTORS[(idx + d + SECTORS.length) % SECTORS.length].id);
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
          <div ref={boxRef} className="mt-12 grid lg:grid-cols-[minmax(0,320px)_1fr] gap-8 items-stretch">
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
                      <button role="option" aria-selected={on} onClick={() => pick(s.id)}
                        className={`relative w-full overflow-hidden text-left px-4 py-3 rounded-[var(--radius)] font-medium transition-colors ${on ? "bg-[var(--color-brand-50)] text-[var(--color-brand-700)]" : "text-[var(--color-ink-soft)] hover:bg-[var(--color-panel)]"}`}>
                        <span className="flex items-center justify-between">
                          {s.name[locale]}
                          {on && <span aria-hidden className="text-[var(--color-brand-500)]">→</span>}
                        </span>
                        {/* the panel moves on by itself; this shows when */}
                        {on && (
                          <motion.span
                            key={s.id + beat}
                            aria-hidden
                            className="absolute bottom-0 left-0 h-[2px] bg-[var(--color-brand-500)]"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3.6, ease: "linear" }}
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Stage, blob visually connected to its system modules */}
            <div className="relative rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-panel-2)] p-6 md:p-8 overflow-hidden">
              <Parallax speed={22} className="pointer-events-none absolute -right-16 -top-16 h-56 w-56">
                <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(41,171,226,.14),transparent_65%)]" />
              </Parallax>
              <p className="relative text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-mute)] mb-4">
                {ui.connected}, <span className="text-[var(--color-brand-600)]">{sector.name[locale]}</span>
              </p>

              {/* desktop: hub + spokes */}
              <div className="relative hidden md:block h-[360px]">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                  {/* keyed by seat, not by sector, so a spoke swings to its new
                      angle when the industry changes instead of blinking out */}
                  <AnimatePresence>
                    {mods.map((_, i) => (
                      <motion.line
                        key={i}
                        x1="29" y1="50" x2="52"
                        stroke="var(--color-brand-300)" strokeWidth="1.4" vectorEffect="non-scaling-stroke"
                        initial={{ y2: 50, opacity: 0 }}
                        animate={{ y2: yFor(i), opacity: 1 }}
                        exit={{ y2: 50, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                      />
                    ))}
                  </AnimatePresence>
                </svg>
                <div className="absolute left-[1%] top-1/2 -translate-y-1/2 w-[210px] h-[176px]">
                  <BlobWithAccessory accessory={sector.accessory} />
                </div>
                {/* The rows belong to the seat, not to the industry: switching
                    sector slides each row to its new height and swaps what is
                    written on it, rather than tearing the whole set down. */}
                <AnimatePresence>
                  {mods.map((m, i) => (
                    <motion.div
                      key={i}
                      className="absolute -translate-y-1/2 flex items-center gap-3 rounded-[var(--radius)] border border-[var(--color-line)] bg-white px-3 py-2 text-sm font-semibold text-[var(--color-ink-soft)] shadow-[var(--shadow-soft)]"
                      style={{ left: "52%", right: "2%" }}
                      initial={{ opacity: 0, top: "50%", x: 10 }}
                      animate={{ opacity: 1, top: `${yFor(i)}%`, x: 0 }}
                      exit={{ opacity: 0, top: "50%", x: 10 }}
                      transition={{ type: "spring", stiffness: 120, damping: 20, delay: i * 0.03 }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={sector.id + m}
                          className="flex min-w-0 items-center gap-3"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.22 }}
                        >
                          <span className="shrink-0 rounded-[9px] shadow-[0_6px_16px_-8px_rgba(10,22,40,.5)]"><AppIcon app={appForLabel(m)} size={30} /></span>
                          <span className="truncate">{m}</span>
                        </motion.span>
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* mobile: stacked */}
              <div className="md:hidden">
                <div className="mx-auto w-[200px] h-[168px]"><BlobWithAccessory accessory={sector.accessory} /></div>
                <ul className="mt-4 grid grid-cols-1 gap-2.5">
                  {mods.map((m, i) => (
                    <motion.li key={i} layout
                      transition={{ type: "spring", stiffness: 140, damping: 20 }}
                      className="flex items-center gap-3 rounded-[var(--radius)] border border-[var(--color-line)] bg-white px-3 py-2 text-sm font-semibold text-[var(--color-ink-soft)]">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={sector.id + m}
                          className="flex min-w-0 items-center gap-3"
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.22 }}
                        >
                          <span className="shrink-0 rounded-[9px] shadow-[0_6px_16px_-8px_rgba(10,22,40,.5)]"><AppIcon app={appForLabel(m)} size={30} /></span>
                          <span className="truncate">{m}</span>
                        </motion.span>
                      </AnimatePresence>
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
