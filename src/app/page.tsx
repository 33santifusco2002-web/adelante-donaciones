import Image from "next/image";
import { hero } from "@/content/site";
import Header from "@/components/Header";
import DonationForm from "@/components/DonationForm";
import ImpactBar from "@/components/ImpactBar";
import Programs from "@/components/Programs";
import Testimonials from "@/components/Testimonials";
import FundsChart from "@/components/FundsChart";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import StickyDonateButton from "@/components/StickyDonateButton";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto max-w-6xl lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-16 lg:px-6 lg:pt-14 lg:pb-24">
          {/* Hero: en mobile la foto con el título ocupa ~40% del alto, así el bloque de donación se ve sin scrollear */}
          <div className="relative lg:flex lg:flex-col">
            <div className="relative h-[40svh] max-h-[60svh] min-h-[260px] overflow-hidden lg:mt-10 lg:aspect-[4/3] lg:h-auto lg:max-h-none lg:rounded-md">
              <Image src="/hero.jpg" alt={hero.imageAlt} fill priority sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent lg:hidden" />
            </div>
            <div className="absolute inset-x-0 bottom-0 px-4 pb-6 text-white sm:px-6 lg:static lg:order-first lg:p-0 lg:text-ink">
              <p className="eyebrow !text-white/80 lg:!text-brand">{hero.eyebrow}</p>
              <h1 className="mt-3 font-display text-[28px] leading-[1.1] font-bold text-balance sm:text-4xl lg:text-[52px] lg:leading-[1.05]">
                {hero.title}
              </h1>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/85 sm:text-lg lg:mt-5 lg:text-muted">{hero.subtitle}</p>
            </div>
          </div>

          <div id="donar" className="scroll-mt-2 border-b border-line bg-white px-4 pt-6 pb-10 sm:px-6 lg:sticky lg:top-8 lg:rounded-xl lg:border lg:p-8 lg:shadow-[0_1px_2px_rgba(23,21,15,0.04),0_24px_48px_-24px_rgba(23,21,15,0.25)]">
            <DonationForm />
          </div>
        </section>

        <ImpactBar />
        <Programs />
        <Testimonials />
        <FundsChart />
        <Faq />
      </main>
      <Footer />
      <StickyDonateButton targetId="donar" />
    </>
  );
}
