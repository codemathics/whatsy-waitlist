"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from "framer-motion";
import Image from "next/image";

const YOUTUBE_VIDEO_ID = "yegZFhUHPmM";
const MODAL_URL = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=0&loop=1&controls=1&modestbranding=1&rel=0&playsinline=1&playlist=${YOUTUBE_VIDEO_ID}`;

declare global {
  interface Window {
    YT: {
      Player: new (
        element: HTMLElement | string,
        options: {
          videoId: string;
          width?: string | number;
          height?: string | number;
          playerVars?: Record<string, number | string>;
        }
      ) => {
        playVideo: () => void;
        pauseVideo: () => void;
        mute: () => void;
        unMute: () => void;
        isMuted: () => boolean;
      };
      ready: (fn: () => void) => void;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

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

const PHONE_DWELL_VH = 500; // ~5 seconds of scroll at typical pace

export default function StorySection() {
  const sectionRef = useRef(null);
  const phoneSectionRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
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
  // blur and fade the phone as it leaves view, same motion language as dashboard
  const phoneBlur = useTransform(phoneScrollProgress, [0.7, 0.92], ["0px", "28px"]);
  const phoneOpacity = useTransform(phoneScrollProgress, [0.72, 0.95], [1, 0]);

  const handleOpen = useCallback(() => {
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

  // autoplay preview when this section is visible, with manual mute toggle
  const playerRef = useRef<InstanceType<Window["YT"]["Player"]> | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const loadYouTubeAPI = () => {
      if (window.YT?.ready) {
        window.YT.ready(initPlayer);
        return;
      }
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScript = document.getElementsByTagName("script")[0];
      firstScript?.parentNode?.insertBefore(tag, firstScript);
      const prevReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prevReady?.();
        window.YT?.ready(initPlayer);
      };
    };
    const initPlayer = () => {
      if (!playerContainerRef.current || playerRef.current) return;
      try {
        playerRef.current = new window.YT.Player(playerContainerRef.current, {
          videoId: YOUTUBE_VIDEO_ID,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            mute: 1,
            loop: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            playlist: YOUTUBE_VIDEO_ID,
            showinfo: 0,
          },
        });
        } catch (_) {}
    };
    loadYouTubeAPI();
  }, []);

  useMotionValueEvent(phoneScrollProgress, "change", (v) => {
    if (v > 0.2 && playerRef.current?.playVideo) {
      playerRef.current.playVideo();
    }
  });

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!playerRef.current) return;
    if (playerRef.current.isMuted?.()) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  }, []);

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
          minHeight: `${isCompactViewport ? 380 : PHONE_DWELL_VH}vh`,
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
          {/* this glow should only show while the phone is centered */}
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
              <div className="story-phone-video">
                <div
                  ref={playerContainerRef}
                  className="absolute inset-0 [&>iframe]:absolute [&>iframe]:top-1/2 [&>iframe]:left-1/2 [&>iframe]:w-[110%] [&>iframe]:h-[110%] [&>iframe]:-translate-x-1/2 [&>iframe]:-translate-y-1/2 [&>iframe]:border-0"
                />
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
              onClick={toggleMute}
              className="story-phone-mute-btn"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              <Image
                src={isMuted ? "/images/volume-mute.svg" : "/images/volume-unmute.svg"}
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
                <iframe
                  src={MODAL_URL}
                  title="Whatsy backstory"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
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
