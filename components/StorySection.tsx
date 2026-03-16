"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from "framer-motion";
import Image from "next/image";

// youtube/vimeo fallback when no self-hosted url
const YOUTUBE_VIDEO_ID = process.env.NEXT_PUBLIC_STORY_VIDEO_ID || "yegZFhUHPmM";
const VIDEO_PROVIDER = process.env.NEXT_PUBLIC_STORY_VIDEO_PROVIDER || "youtube";

// build embed urls, ignored when useSelfHosted
const YOUTUBE_NCOOKIE = `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}`;
const MODAL_URL =
  VIDEO_PROVIDER === "vimeo"
    ? `https://player.vimeo.com/video/${YOUTUBE_VIDEO_ID}?autoplay=1&title=0&byline=0&portrait=0`
    : `${YOUTUBE_NCOOKIE}?autoplay=1&mute=0&loop=1&controls=1&modestbranding=1&rel=0&playsinline=1&playlist=${YOUTUBE_VIDEO_ID}`;
const PHONE_PREVIEW_URL =
  VIDEO_PROVIDER === "vimeo"
    ? `https://player.vimeo.com/video/${YOUTUBE_VIDEO_ID}?autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0`
    : `${YOUTUBE_NCOOKIE}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0&playsinline=1&playlist=${YOUTUBE_VIDEO_ID}`;

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

const PHONE_DWELL_VH = 500; // ~5 screens of scroll on desktop
const PHONE_DWELL_VH_MOBILE = 120; // ~1 screen on mobile – reduced so next section appears quickly

export default function StorySection() {
  const sectionRef = useRef(null);
  const phoneSectionRef = useRef(null);
  const phoneVideoRef = useRef<HTMLVideoElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  // fetch from api so we read env server-side (avoids next_public_ build-time issues)
  const [storyVideoUrl, setStoryVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/config/story-video")
      .then((r) => r.json())
      .then((data) => data?.url && setStoryVideoUrl(data.url))
      .catch(() => {});
  }, []);

  const useSelfHosted = !!storyVideoUrl;

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

  const textFadeOpacity = useTransform(scrollYProgress, [0.58, 0.78], [1, 0]);
  const textBlur = useTransform(scrollYProgress, [0.58, 0.78], ["0px", "14px"]);

  const { scrollYProgress: phoneScrollProgress } = useScroll({
    target: phoneSectionRef,
    offset: ["start end", "end start"],
  });
  const gradientOpacity = useTransform(
    phoneScrollProgress,
    [0.15, 0.35, 0.65, 0.85],
    [0, 1, 1, 0]
  );
  // blur and fade phone as it leaves view, same motion as dashboard
  const phoneBlur = useTransform(phoneScrollProgress, [0.7, 0.92], ["0px", "28px"]);
  const phoneOpacity = useTransform(phoneScrollProgress, [0.72, 0.95], [1, 0]);

  const handleOpen = useCallback(() => {
    phoneVideoRef.current?.pause();
    setModalOpen(true);
    setModalClosing(false);
    document.body.style.overflow = "hidden";
    setTimeout(() => setModalVisible(true), 50);
  }, []);

  const handleClose = useCallback(() => {
    setModalClosing(true);
    setModalVisible(false);
    setTimeout(() => {
      setModalOpen(false);
      setModalClosing(false);
      document.body.style.overflow = "";
      // resume phone video (no-op when iframe/ref null)
      phoneVideoRef.current?.play().catch(() => {});
    }, 500);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, handleClose]);

  // lazy-load iframe when phone in view (avoids loading youtube before scroll)
  const [phoneVideoReady, setPhoneVideoReady] = useState(false);
  useMotionValueEvent(phoneScrollProgress, "change", (v) => {
    if (v > 0.15 && !phoneVideoReady) setPhoneVideoReady(true);
  });
  // also show on mount if user scrolls directly to section or small viewport
  useEffect(() => {
    const timer = setTimeout(() => setPhoneVideoReady((r) => r || true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // mute button: self-hosted unmutes in-place; embed opens modal for sound
  const [isMuted, setIsMuted] = useState(true);
  const handleMuteClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const video = phoneVideoRef.current;
      if (storyVideoUrl && video) {
        video.muted = !video.muted;
        setIsMuted(video.muted);
        if (!video.muted) video.play().catch(() => {}); // resume if browser paused on unmute
      } else {
        handleOpen();
      }
    },
    [handleOpen, storyVideoUrl]
  );

  return (
    <>
      <div
        ref={sectionRef}
        id="story"
        style={{
          height: isCompactViewport ? "240vh" : "300vh",
          paddingTop: isCompactViewport ? 72 : 100,
          position: "relative",
          zIndex: 25,
        }}
      >
        <div
          className="sticky top-0 flex items-center justify-center px-4 sm:px-6"
          style={{ height: "100vh", zIndex: 30 }}
        >
          <motion.div
            className="max-w-[680px] w-full mx-auto text-center"
            style={{
              opacity: textFadeOpacity,
              filter: useTransform(textBlur, (v) => `blur(${v})`),
            }}
          >
            <h2 className="font-display text-[clamp(2.2rem,5vw,4.6rem)] leading-[0.96] tracking-[-0.06em] text-black">
              <WordReveal
                text={`...it all started as a\npersonal tool, built to\nsolve a specific\nproblem around\nschedules, conversations\nand just keeping up. it\nturns out it wasn't just a\npersonal problem\nafterall.`}
                progress={scrollYProgress}
                start={0}
                end={0.55}
              />
            </h2>
          </motion.div>
        </div>
      </div>

      <div
        ref={phoneSectionRef}
        style={{
          marginTop: "-100vh",
          position: "relative",
          zIndex: 35,
          minHeight: `${isCompactViewport ? PHONE_DWELL_VH_MOBILE : PHONE_DWELL_VH}vh`,
        }}
      >
        <div
          className="sticky top-0 flex items-center justify-center px-4 sm:px-6 relative"
          style={{
            minHeight: "100vh",
            paddingTop: isCompactViewport ? "9vh" : "12vh",
            paddingBottom: "4vh",
          }}
        >
          {/* glow only visible while phone is centered */}
          <motion.div
            className="story-phone-gradient"
            style={{ opacity: gradientOpacity }}
            aria-hidden
          />
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
            style={{
              opacity: phoneOpacity,
              filter: useTransform(phoneBlur, (v) => `blur(${v})`),
            }}
          >
            <button
              className="story-phone-button"
              onClick={handleOpen}
              aria-label="Watch backstory video"
            >
              <div className="story-phone-video bg-neutral-900">
                <div className="absolute inset-0 [&>iframe]:absolute [&>iframe]:top-1/2 [&>iframe]:left-1/2 [&>iframe]:w-[110%] [&>iframe]:h-[110%] [&>iframe]:-translate-x-1/2 [&>iframe]:-translate-y-1/2 [&>iframe]:border-0 [&>video]:absolute [&>video]:top-1/2 [&>video]:left-1/2 [&>video]:w-[110%] [&>video]:h-[110%] [&>video]:-translate-x-1/2 [&>video]:-translate-y-1/2 [&>video]:object-cover [&>video]:border-0">
                  {phoneVideoReady &&
                    (useSelfHosted ? (
                      <video
                        ref={phoneVideoRef}
                        src={storyVideoUrl}
                        autoPlay
                        muted={isMuted}
                        loop
                        playsInline
                        preload="auto"
                        onLoadedData={(e) => e.currentTarget.play().catch(() => {})}
                        onCanPlay={(e) => e.currentTarget.play().catch(() => {})}
                        className="absolute top-1/2 left-1/2 w-[110%] h-[110%] -translate-x-1/2 -translate-y-1/2 object-cover border-0 bg-neutral-900"
                      />
                    ) : (
                      <iframe
                        src={PHONE_PREVIEW_URL}
                        title="Whatsy backstory preview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-1/2 left-1/2 w-[110%] h-[110%] -translate-x-1/2 -translate-y-1/2 border-0"
                      />
                    ))}
                </div>
              </div>
              <div className="story-phone-overlay">
                <div className="story-phone-arrows">
                  <svg width="28" height="28" viewBox="0 0 12 12" fill="none" className="story-arrow-tr">
                    <path d="M3 9L9 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M4 3H9V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <svg width="28" height="28" viewBox="0 0 12 12" fill="none" className="story-arrow-bl">
                    <path d="M9 3L3 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 9H3V4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={handleMuteClick}
              className="story-phone-mute-btn"
              aria-label={useSelfHosted ? (isMuted ? "Unmute video" : "Mute video") : "Watch with sound"}
            >
              <Image
                src={useSelfHosted && !isMuted ? "/images/volume-unmute.svg" : "/images/volume-mute.svg"}
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </button>
          </motion.div>
        </div>
      </div>

      {modalOpen && (
        <div className="story-modal-overlay">
          <div className={`story-modal-panel ${modalVisible && !modalClosing ? "visible" : ""} ${modalClosing ? "closing" : ""}`}>
            <div className={`story-modal-content ${modalVisible && !modalClosing ? "visible" : ""} ${modalClosing ? "closing" : ""}`}>
              <button
                className={`story-modal-close ${modalVisible && !modalClosing ? "visible" : ""} ${modalClosing ? "closing" : ""}`}
                onClick={handleClose}
                aria-label="Close video"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              <div className="story-modal-video">
                {useSelfHosted ? (
                  <video
                    src={storyVideoUrl}
                    autoPlay
                    loop
                    playsInline
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <iframe
                    src={MODAL_URL}
                    title="Whatsy backstory"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>

              <div className="story-modal-esc">
                press <kbd>esc</kbd> to close
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
