import Header from "./Header";
import Hero from "./Hero";
import { WhatWeBuild, Process } from "./Sections";
import ScaleGraph from "./ScaleGraph";
import RequestJourney from "./RequestJourney";
import DayFeed from "./DayFeed";
import SpeedRace from "./SpeedRace";
import SystemComparison from "./SystemComparison";
import SectorSwitcher from "./SectorSwitcher";
import AutomationPicker from "./AutomationPicker";
import CostRace from "./CostRace";
import Uncomparable from "./Uncomparable";
import Contact from "./Contact";
import Footer from "./Footer";
import { JsonLd } from "@/lib/seo";
import type { Locale } from "@/content/site";

/** Full homepage, shared by the EN (/) and FR (/fr) routes. */
export default function Page({ locale }: { locale: Locale }) {
  return (
    <>
      <JsonLd locale={locale} />
      <Header locale={locale} />
      <main>
        <Hero locale={locale} />
        <WhatWeBuild locale={locale} />
        <ScaleGraph locale={locale} />
        <RequestJourney locale={locale} />
        <DayFeed locale={locale} />
        <SystemComparison locale={locale} />
        <SectorSwitcher locale={locale} />
        <AutomationPicker locale={locale} />
        <Process locale={locale} />
        <SpeedRace locale={locale} />
        <CostRace locale={locale} />
        <Uncomparable locale={locale} />
        <Contact locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
