"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "./Footer";
import ScrollReveal from "./ScrollReveal";

type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type LegalPageProps = {
  title: string;
  description: string;
  effectiveDate: string;
  sections: LegalSection[];
};

export default function LegalPage({
  title,
  description,
  effectiveDate,
  sections,
}: LegalPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-black/[0.04] bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 md:px-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo-with-wordmark.svg"
              alt="Whatsy"
              width={117}
              height={37}
              className="h-8"
              style={{ width: "auto" }}
              priority
            />
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-black/55 transition-colors hover:text-black"
          >
            Back home
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-6 pb-8 pt-20 md:px-8 md:pb-12 md:pt-28">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(92,227,162,0.28) 0%, rgba(180,114,255,0.16) 45%, transparent 72%)",
                filter: "blur(80px)",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-[920px] text-center">
            <ScrollReveal>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-black/40">
                Legal
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <h1 className="mt-4 font-display text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.96] tracking-[-0.06em] text-black">
                {title}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <p className="mx-auto mt-5 max-w-[720px] text-base leading-relaxed text-black/70 md:text-lg">
                {description}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.18}>
              <p className="mt-5 text-sm text-black/45">
                Effective date: {effectiveDate}
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="px-6 pb-20 md:px-8 md:pb-28">
          <div className="mx-auto max-w-[860px] rounded-[32px] border border-black/[0.06] bg-white/80 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.03)] backdrop-blur-xl md:p-10">
            <div className="space-y-10">
              {sections.map((section, index) => (
                <ScrollReveal key={section.title} delay={0.03 * index}>
                  <section className="border-b border-black/[0.05] pb-10 last:border-b-0 last:pb-0">
                    <h2 className="text-xl font-semibold tracking-[-0.03em] text-black md:text-2xl">
                      {section.title}
                    </h2>

                    <div className="mt-4 space-y-4">
                      {section.paragraphs.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="text-sm leading-7 text-black/72 md:text-[15px]"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {section.bullets && section.bullets.length > 0 ? (
                      <ul className="mt-4 space-y-2">
                        {section.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex gap-3 text-sm leading-7 text-black/72 md:text-[15px]"
                          >
                            <span className="mt-[11px] h-1.5 w-1.5 rounded-full bg-brand-green" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
