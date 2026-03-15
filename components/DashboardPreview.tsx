"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

export default function DashboardPreview() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.95]);
  const rotateX = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [8, 0, 0, -4]);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-8 px-6 md:px-12"
      style={{ position: "relative" }}
    >
      <ScrollReveal className="max-w-[1200px] mx-auto" direction="none" duration={1}>
        <motion.div
          style={{ y, scale, rotateX, perspective: 1200 }}
          className="relative"
        >
          {/* soft glow behind dashboard */}
          <div className="absolute inset-0 -inset-x-8 -inset-y-8">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] rounded-full opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(92,227,162,0.4) 0%, transparent 70%)",
                filter: "blur(80px)",
              }}
            />
          </div>

          {/* dashboard image */}
          <div className="relative dashboard-window overflow-hidden">
            <Image
              src="/images/dashboard-preview.png"
              alt="Whatsy Dashboard"
              width={2481}
              height={1530}
              className="w-full h-auto"
              quality={95}
              priority
            />
          </div>
        </motion.div>
      </ScrollReveal>
    </section>
  );
}
