import Splash from "./Splash";
import Header from "./Header";
import Hero from "./Hero";
import { WhatWeBuild, Process, Pricing } from "./Sections";
import ScaleGraph from "./ScaleGraph";
import TimeGame from "./TimeGame";
import Resilience from "./Resilience";
import SectorSwitcher from "./SectorSwitcher";
import AutomationPicker from "./AutomationPicker";
import CompetitionGraph from "./CompetitionGraph";
import Uncomparable from "./Uncomparable";
import Contact from "./Contact";
import Footer from "./Footer";
import { JsonLd } from "@/lib/seo";
import type { Locale } from "@/content/site";

/** Full homepage, shared by the EN (/) and FR (/fr) routes. */
export default function Page({ locale }: { locale: Locale }) {
  return (
    <>
      <Splash />
      <JsonLd locale={locale} />
      <Header locale={locale} />
      <main>
        <Hero locale={locale} />
        <WhatWeBuild locale={locale} />
        <ScaleGraph locale={locale} />
        <TimeGame locale={locale} />
        <Resilience locale={locale} />
        <SectorSwitcher locale={locale} />
        <AutomationPicker locale={locale} />
        <Process locale={locale} />
        <CompetitionGraph locale={locale} />
        <Pricing locale={locale} />
        <Uncomparable locale={locale} />
        <Contact locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
