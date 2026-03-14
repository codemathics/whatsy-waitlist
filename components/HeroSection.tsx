"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import GlassDashboard from "./GlassDashboard";
import CryFaceEmoji from "./CryFaceEmoji";

export default function HeroSection() {
  const sectionRef = useRef(null);
  const [isCompactViewport, setIsCompactViewport] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    const updateViewport = () => setIsCompactViewport(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    mass: 0.1,
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  // keep the cinematic feel on desktop, but reduce scroll length on mobile/tablet
  const SECTION_HEIGHT_VH = isCompactViewport ? 350 : 450;

  const dashScale = useTransform(
    smoothProgress,
    [0, isCompactViewport ? 0.22 : 0.18],
    [isCompactViewport ? 0.95 : 0.85, isCompactViewport ? 1 : 1.05]
  );
  const dashY = useTransform(
    smoothProgress,
    [0, isCompactViewport ? 0.22 : 0.18],
    [isCompactViewport ? "14vh" : "20vh", "0vh"]
  );
  const dashBlur = useTransform(smoothProgress, [0.62, 0.88], ["0px", "28px"]);
  const dashOpacity = useTransform(smoothProgress, [0.65, 0.9], [1, 0]);

  const blob1Y = useTransform(smoothProgress, [0, 1], ["0%", "-20%"]);
  const blob2Y = useTransform(smoothProgress, [0, 1], ["0%", "-15%"]);
  const blobOpacity = useTransform(smoothProgress, [0.6, 0.9], [0.6, 0]);

  const heroOpacity = useTransform(
    smoothProgress,
    isCompactViewport ? [0.08, 0.28] : [0.05, 0.2],
    [1, 0]
  );
  const heroScale = useTransform(
    smoothProgress,
    isCompactViewport ? [0.08, 0.28] : [0.05, 0.2],
    [1, 0.92]
  );
  const heroBlur = useTransform(
    smoothProgress,
    isCompactViewport ? [0.08, 0.28] : [0.05, 0.2],
    ["0px", "10px"]
  );

  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={sectionRef}
      style={{ height: `${SECTION_HEIGHT_VH}vh`, position: "relative", marginBottom: "-100vh", zIndex: 20 }}
    >
      <div className="fixed inset-0 pointer-events-none z-0" style={{ overflow: "hidden" }}>
        <motion.div
          className="absolute gradient-blob-1 rounded-[72px]"
          style={{
            top: "15%",
            right: "-5%",
            width: isCompactViewport ? 440 : 660,
            height: isCompactViewport ? 440 : 660,
            filter: "blur(475px)",
            y: blob1Y,
            opacity: blobOpacity,
          }}
        />
        <motion.div
          className="absolute gradient-blob-2 rounded-full"
          style={{
            top: "35%",
            left: "-5%",
            width: isCompactViewport ? 300 : 465,
            height: isCompactViewport ? 300 : 465,
            filter: "blur(475px)",
            y: blob2Y,
            opacity: blobOpacity,
          }}
        />
      </div>

      <motion.div
        className="sticky top-0 z-10 px-4 sm:px-6"
        style={{
          height: "100vh",
          paddingTop: isCompactViewport ? "22vh" : 320,
          opacity: heroOpacity,
          scale: heroScale,
          filter: useTransform(heroBlur, (v) => `blur(${v})`),
          transformOrigin: "top center",
        }}
      >
        <div className="max-w-[680px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 md:hidden inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 backdrop-blur-sm border border-black/5"
          >
            <Image src="/images/apple-icon.svg" alt="" width={14} height={14} className="opacity-60" />
            <span className="text-[11px] font-medium text-black/70">coming soon on macOS</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-display text-[clamp(2.05rem,8vw,5rem)] leading-[0.96] tracking-[-0.055em] text-black">
              Your conversations
              <br />
              doesn&apos;t <em className="italic">always</em> have to
              <br />
              suck{" "}
              <CryFaceEmoji />
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-[14px] sm:text-[15px] md:text-[17px] text-black/50 leading-[1.5] max-w-[520px] mx-auto font-sans px-2 sm:px-0"
          >
            Whatsy helps you chat with your contacts when you are unavailable in
            a way that feels human, personal, and true to you. Private by
            design, everything runs securely on your local machine.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-[9px]"
          >
            <button
              onClick={scrollToWaitlist}
              className="btn-join w-full sm:w-auto text-[14px] font-semibold text-white px-5 py-2.5 rounded-full cursor-pointer transition-all duration-200"
            >
              Join Waitlist
            </button>
            <a
              href="#story"
              className="btn-glass-dark w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[14px] font-medium text-white px-5 py-2.5 rounded-full"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-80">
                <path d="M5 3.5L10 7L5 10.5V3.5Z" fill="white" />
              </svg>
              Back Story
            </a>
          </motion.div>
        </div>
      </motion.div>

      <div
        className="sticky top-0 z-20 px-2 sm:px-4 md:px-6 flex items-center justify-center"
        style={{ height: "100vh", overflow: isCompactViewport ? "hidden" : "visible" }}
      >
        <motion.div
          className="max-w-[1440px] mx-auto w-full"
          style={{
            scale: dashScale,
            y: dashY,
            opacity: dashOpacity,
            filter: useTransform(dashBlur, (v) => `blur(${v})`),
            transformOrigin: "center center",
          }}
        >
          <GlassDashboard scrollProgress={smoothProgress} />
        </motion.div>
      </div>
    </div>
  );
}
