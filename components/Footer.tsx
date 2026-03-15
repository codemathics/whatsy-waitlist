"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import LogoLottie from "./LogoLottie";

export default function Footer() {
  return (
    <footer className="border-black/5 py-10 sm:py-12 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto">
        <ScrollReveal once={false}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <LogoLottie size="sm" />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <p className="text-center md:text-left text-sm text-text-muted">
                All data stays on your device. No telemetry. No cloud LLM.
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                <span className="text-xs font-medium text-text-secondary">
                  Private by design
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} once={false}>
          <div className="mt-8 flex flex-col gap-4 border-t border-black/5 pt-6 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-text-muted">
              &copy; {new Date().getFullYear()} Whatsy. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:justify-end">
              <a
                href="https://instagram.com/meetwhatsy"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-text-muted transition-colors hover:text-text-secondary"
              >
                Instagram
              </a>
              <a
                href="https://x.com/whatsyai"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-text-muted transition-colors hover:text-text-secondary"
              >
                X
              </a>
              <a
                href="https://tiktok.com/meetwhatsy"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-text-muted transition-colors hover:text-text-secondary"
              >
                TikTok
              </a>
              <Link
                href="/privacy-policy"
                className="text-xs text-text-muted hover:text-text-secondary transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms-and-conditions"
                className="text-xs text-text-muted hover:text-text-secondary transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
