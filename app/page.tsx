"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import LoaderAnimation from "@/components/LoaderAnimation";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StorySection from "@/components/StorySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WaitlistSection from "@/components/WaitlistSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const [showNavbarBackground, setShowNavbarBackground] = useState(false);
  const testimonialsAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaded) return;

    const el = testimonialsAnchorRef.current;
    if (!el) return;

    const handleScroll = () => {
      const hasReachedTestimonials = el.getBoundingClientRect().top <= window.innerHeight;
      setShowNavbarBackground((prev) =>
        prev === hasReachedTestimonials ? prev : hasReachedTestimonials
      );
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [loaded]);

  const handleLoaderComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && <LoaderAnimation onComplete={handleLoaderComplete} />}

      {loaded && (
        <div>
          <Navbar showBackground={showNavbarBackground} />
          <main>
            <HeroSection />
            <StorySection />
            <div ref={testimonialsAnchorRef}>
              <TestimonialsSection />
            </div>
            <WaitlistSection />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}
