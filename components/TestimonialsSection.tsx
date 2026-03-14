"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from "framer-motion";

function Word({
  children,
  progress,
  start,
  end,
}: {
  children: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{" "}
    </motion.span>
  );
}

function WordReveal({
  text,
  progress,
  start,
  end,
  className,
}: {
  text: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  className?: string;
}) {
  const lines = text.split("\n");
  const allLineWords = lines.map((line) => line.trim().split(/\s+/));
  const totalWords = allLineWords.reduce((sum, lw) => sum + lw.length, 0);
  const range = end - start;
  const step = range / totalWords;

  let wi = 0;

  return (
    <span className={className}>
      {allLineWords.map((lineWords, lineIdx) => (
        <span key={lineIdx}>
          {lineIdx > 0 && <br />}
          {lineWords.map((word) => {
            const idx = wi++;
            return (
              <Word
                key={idx}
                progress={progress}
                start={start + idx * step}
                end={start + (idx + 1) * step}
              >
                {word}
              </Word>
            );
          })}
        </span>
      ))}
    </span>
  );
}

const LINKEDIN_POST = "https://www.linkedin.com/feed/update/urn:li:activity:7431650805419622400/";
const INSTAGRAM_REEL = "https://www.instagram.com/reel/DVGLjeWDuPB/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==";

const COLUMNS = [
  [
    { src: "/images/testimonials/card-1.png", w: 832, h: 526, href: LINKEDIN_POST, white: true },
    { src: "/images/testimonials/card-6.png", w: 832, h: 344, href: LINKEDIN_POST, white: true },
    { src: "/images/testimonials/card-7.png", w: 832, h: 312, href: LINKEDIN_POST, white: true },
    { src: "/images/testimonials/card-10.png", w: 832, h: 268, href: INSTAGRAM_REEL, white: false },
  ],
  [
    { src: "/images/testimonials/card-2.png", w: 832, h: 526, href: LINKEDIN_POST, white: true },
    { src: "/images/testimonials/card-8.png", w: 832, h: 344, href: LINKEDIN_POST, white: true },
    { src: "/images/testimonials/card-9.png", w: 832, h: 344, href: LINKEDIN_POST, white: true },
    { src: "/images/testimonials/card-11.png", w: 832, h: 344, href: INSTAGRAM_REEL, white: false },
  ],
  [
    { src: "/images/testimonials/card-3.png", w: 832, h: 344, href: LINKEDIN_POST, white: true },
    { src: "/images/testimonials/card-4.png", w: 832, h: 344, href: LINKEDIN_POST, white: true },
    { src: "/images/testimonials/card-5.png", w: 832, h: 344, href: LINKEDIN_POST, white: true },
    { src: "/images/testimonials/card-12.png", w: 832, h: 302, href: INSTAGRAM_REEL, white: false },
    { src: "/images/testimonials/card-13.png", w: 832, h: 292, href: INSTAGRAM_REEL, white: false },
  ],
];

const DELAYS = [
  [0.08, 0.28, 0.44, 0.58],
  [0.18, 0.36, 0.48, 0.6],
  [0.12, 0.32, 0.42, 0.54, 0.66],
];

export default function TestimonialsSection() {
  const headingRef = useRef(null);
  const cardsRef = useRef(null);
  const [hasReached, setHasReached] = useState(false);

  const { scrollYProgress } = useScroll({
    target: headingRef,
    offset: ["start end", "end center"],
  });

  const { scrollYProgress: cardsProgress } = useScroll({
    target: cardsRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(cardsProgress, "change", (v) => {
    if (v > 0.12) setHasReached(true);   // only mark "reached" when firmly in view
    if (v < 0.01) setHasReached(false);  // only reset when fully scrolled back up past section
  });

  return (
    <section className="relative" style={{ paddingBottom: "10vh", zIndex: 30 }}>
      <div className="px-4 sm:px-6">
        <h2
          ref={headingRef}
          className="font-display text-center text-black mx-auto"
          style={{
            maxWidth: 1260,
            fontSize: "clamp(2.4rem, 5.2vw, 4.8rem)",
            lineHeight: 0.96,
            letterSpacing: "-0.06em",
          }}
        >
          <WordReveal
            text={`...apparently, many others\nlike me wanted it too.`}
            progress={scrollYProgress}
            start={0}
            end={1}
          />
        </h2>
      </div>

      <div
        ref={cardsRef}
        className="mx-auto px-4 sm:px-6 lg:px-10"
        style={{ marginTop: "clamp(24px, 4vh, 56px)", maxWidth: 1440 }}
      >
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {COLUMNS.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-5">
              {col.map((card, ri) => (
                <motion.a
                  key={ri}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="testimonial-card-link group block relative w-full overflow-hidden cursor-pointer"
                  style={{
                    borderRadius: "clamp(10px, 1.4vw, 18px)",
                    aspectRatio: `${card.w} / ${card.h}`,
                  }}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: hasReached ? 0 : 60, opacity: hasReached ? 1 : 0 }}
                  transition={{
                    delay: hasReached ? DELAYS[ci][ri] : 0,
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Image
                    src={card.src}
                    alt="Testimonial"
                    fill
                    sizes="(max-width: 768px) 90vw, 33vw"
                    style={{ objectFit: "cover" }}
                    draggable={false}
                  />
                </motion.a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6">
        <motion.p
          className="text-center mx-auto"
          style={{
            marginTop: "clamp(32px, 4vh, 56px)",
            maxWidth: 710,
            fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
            lineHeight: 1.3,
            color: "rgba(0, 0, 0, 0.8)",
            letterSpacing: "-0.02em",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true }}
        >
          ...so, i started building it with <em><strong>everyone</strong></em> in mind. ;)
        </motion.p>
      </div>
    </section>
  );
}
