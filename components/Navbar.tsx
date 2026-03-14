"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import LogoLottie from "./LogoLottie";

export default function Navbar({
  showBackground = false,
}: {
  showBackground?: boolean;
}) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`fixed top-0 left-0 right-0 z-50 border-0 shadow-none transition-[background-color,backdrop-filter] duration-300 ${
        showBackground
          ? "bg-white/40 backdrop-blur-xl supports-[backdrop-filter]:bg-white/30"
          : "bg-transparent backdrop-blur-0"
      }`}
    >
      <div className="mx-auto max-w-[1440px] flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <LogoLottie href="#" size="md" />

        <div className="hidden md:flex items-center gap-1.5 sm:gap-2">
          <Image
            src="/images/apple-icon.svg"
            alt=""
            width={14}
            height={14}
            className="opacity-60"
          />
          <span className="text-[11px] sm:text-[13px] font-medium text-black/70">
            Coming soon on macOS
          </span>
        </div>
      </div>
    </motion.header>
  );
}
