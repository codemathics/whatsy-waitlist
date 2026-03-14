"use client";

import React from "react";
import { motion, AnimatePresence, useMotionValueEvent, useMotionValue, type MotionValue } from "framer-motion";
import Image from "next/image";

const SPACING = 8;

function TrafficLights() {
  return (
    <div className="flex items-center gap-[6px]">
      <div className="w-[12px] h-[12px] rounded-full bg-[#FF5F57]" />
      <div className="w-[12px] h-[12px] rounded-full bg-[#FDBC2E]" />
      <div className="w-[12px] h-[12px] rounded-full bg-[#28C840]" />
    </div>
  );
}

function SidebarNavItem({
  label,
  active = false,
  iconSrc,
}: {
  label: string;
  active?: boolean;
  iconSrc: string;
}) {
  return (
    <div
      className={`flex items-center gap-[6px] px-[6px] py-[6px] rounded-[6px] text-[12px] font-medium tracking-[-0.01em] ${
        active ? "bg-black/[0.04] text-black/80" : "text-black/40"
      }`}
    >
      <Image src={iconSrc} alt="" width={14} height={14} className="opacity-60" style={{ width: 14, height: 14 }} />
      <span>{label}</span>
    </div>
  );
}

function FeedItem({
  contact, time, title, description, status, avatarSrc, delay,
}: {
  contact: string; time: string; title: string; description: string; status: string; avatarSrc: string; delay: number;
}) {
  return (
    <motion.div
      className="glass-card rounded-[12px] flex flex-col gap-[6px]"
      style={{ padding: 12 }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[4px]">
          <Image src={avatarSrc} alt="" width={16} height={16} unoptimized className="rounded-full flex-shrink-0" style={{ width: 16, height: 16, objectFit: "cover" }} />
          <span className="text-[9px] font-bold text-black/40">{contact}</span>
        </div>
        <span className="text-[9px] font-bold text-black/30">{time}</span>
      </div>
      <div className="font-display text-[14px] leading-[0.95] tracking-[-0.03em] text-black/80">{title}</div>
      <div className="text-[9px] text-black/50 leading-[1.4]">{description}</div>
      <div className="self-start px-[6px] py-[2px] rounded-[4px] bg-black/[0.04] text-[8px] font-semibold text-black/60">
        {status}
      </div>
    </motion.div>
  );
}

const BAR_HEIGHTS = [96, 130, 74, 123, 101, 26, 36, 47, 92, 84, 117, 107, 60, 80];
const MAX_BAR = 130;

function BarChart() {
  return (
    <div className="flex flex-col" style={{ gap: 4 }}>
      <div className="flex items-end w-full" style={{ height: 100, gap: SPACING }}>
        {BAR_HEIGHTS.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-[3px]"
            style={{
              height: `${(h / MAX_BAR) * 100}%`,
              background: "#5CE3A2",
              transformOrigin: "bottom",
            }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.04, ease: "easeOut" }}
          />
        ))}
      </div>
      <div className="flex" style={{ gap: SPACING }}>
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} className="flex-1 text-center text-[8px] font-semibold text-black/30">
            {i + 1}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] font-medium text-black/40">{label}</span>
      <span className="text-[12px] font-semibold text-black/60">{value}</span>
    </div>
  );
}

function Separator() {
  return <div className="w-full" style={{ height: 0.38, background: "rgba(0,0,0,0.06)" }} />;
}

// figma refs: deactivated 463-534, activated 463-530
// track 32x76, thumb 24x34; deactivated = knob at top, activated = knob at bottom
const TOGGLE_TRACK_W = 32;
const TOGGLE_TRACK_H = 76;
const TOGGLE_THUMB_W = 24;
const TOGGLE_THUMB_H = 34;
const TOGGLE_PADDING = 4;
const THUMB_BOTTOM_OFF = TOGGLE_TRACK_H - TOGGLE_THUMB_H - TOGGLE_PADDING; // top position
const THUMB_BOTTOM_ON = TOGGLE_PADDING; // bottom position

export default function GlassDashboard({ scrollProgress }: { scrollProgress?: MotionValue<number> }) {
  const [scale, setScale] = React.useState(1);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [wrapH, setWrapH] = React.useState(632);
  const [isActivated, setIsActivated] = React.useState(false);
  const [isMobileView, setIsMobileView] = React.useState(false);

  const fallbackProgress = useMotionValue(0);
  // activate in the dwell zone and only switch back off when scrolling up again
  useMotionValueEvent(scrollProgress ?? fallbackProgress, "change", (v) => {
    setIsActivated(v >= 0.38);
  });

  React.useEffect(() => {
    function calc() {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (mobile) return;
      const available = window.innerWidth - 48;
      const s = Math.min(1, available / 1108);
      setScale(s);
      const h = innerRef.current?.scrollHeight ?? 632;
      setWrapH(h * s);
    }
    calc();
    const t = setTimeout(calc, 600);
    window.addEventListener("resize", calc);
    return () => { window.removeEventListener("resize", calc); clearTimeout(t); };
  }, []);

  if (isMobileView) {
    return (
      <motion.div
        className="mx-auto w-full max-w-[420px] px-2"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="glass-dashboard rounded-[22px] p-3 space-y-3">
          <div className="glass-sidebar rounded-[16px] p-3 space-y-3">
            <div className="flex items-center justify-between">
              <TrafficLights />
              <Image
                src="/images/nav-toggle.svg"
                alt=""
                width={15}
                height={15}
                unoptimized
                className="opacity-60"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <SidebarNavItem label="Home" active iconSrc="/images/icon-home.svg" />
              <SidebarNavItem label="Personas" iconSrc="/images/icon-personas.svg" />
              <SidebarNavItem label="Logs" iconSrc="/images/icon-logs.svg" />
            </div>
          </div>

          <div className="glass-card rounded-[16px] p-3 space-y-2">
            <div className="text-[11px] font-medium text-black/45">Current Status</div>
            <div className="font-display text-[20px] leading-[0.95] tracking-[-0.03em] text-black/80">
              {isActivated ? "Agent is active" : "Agent is inactive"}
            </div>
            <button
              type="button"
              onClick={() => setIsActivated(!isActivated)}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-black/[0.05] hover:bg-black/[0.08] transition-colors"
              aria-label={isActivated ? "Deactivate agent" : "Activate agent"}
            >
              <span className={`h-2 w-2 rounded-full ${isActivated ? "bg-[#76E6B1]" : "bg-black/25"}`} />
              <span className="text-[11px] font-semibold text-black/60">
                {isActivated ? "Deactivate" : "Activate"}
              </span>
            </button>
          </div>

          <div className="glass-card rounded-[16px] p-3 space-y-2">
            <div className="text-[12px] font-medium text-black/80">Live Feed</div>
            <FeedItem
              contact="+1 426 674 7463"
              time="Just now"
              title="Booking inquiry"
              description="Availability shared, contact confirmed for Tuesday."
              status="Replied"
              avatarSrc="/images/feed-avatar-1.png"
              delay={0.1}
            />
            <FeedItem
              contact="Navi My Gee 🔥"
              time="2m ago"
              title="Chat skipped (family)"
              description="Rule #4 triggered. Family contacts are never auto-replied."
              status="Skipped"
              avatarSrc="/images/feed-avatar-2.png"
              delay={0.15}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ height: wrapH, position: "relative", overflow: "hidden" }}>
      <div style={{ width: scale * 1108, margin: "0 auto" }}>
        <motion.div
          ref={innerRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: 1108, transform: `scale(${scale})`, transformOrigin: "top left" }}
        >
          <div className="glass-dashboard rounded-[33px] flex" style={{ padding: 8, gap: 8, minWidth: 900 }}>
            <div className="glass-sidebar flex-shrink-0 rounded-[25px] flex flex-col justify-between" style={{ width: 200, padding: 6 }}>
              <div className="flex flex-col gap-[6px]">
                <div className="flex items-center justify-between px-[6px] py-[6px]">
                  <TrafficLights />
                  <Image src="/images/nav-toggle.svg" alt="" width={15} height={15} unoptimized className="flex-shrink-0" style={{ width: 15, height: 15 }} />
                </div>
                <div className="flex flex-col gap-[3px]">
                  <SidebarNavItem label="Home" active iconSrc="/images/icon-home.svg" />
                  <SidebarNavItem label="Personas" iconSrc="/images/icon-personas.svg" />
                  <SidebarNavItem label="Behavior" iconSrc="/images/icon-behavior.svg" />
                </div>
                <div className="mt-[18px] flex flex-col gap-[3px]">
                  <div className="px-[5px] py-[3px] rounded-[6px] bg-white/20 text-[11px] font-bold text-black/80">System</div>
                  <SidebarNavItem label="Logs" iconSrc="/images/icon-logs.svg" />
                  <SidebarNavItem label="Settings" iconSrc="/images/icon-settings.svg" />
                </div>
              </div>
              <div className="flex items-center gap-[6px] rounded-[18px] bg-black/[0.04]" style={{ padding: "9px 12px 9px 9px" }}>
                <Image src="/images/profile-avatar.png" alt="" width={31} height={31} unoptimized className="rounded-[15px] flex-shrink-0 border border-white/20" style={{ width: 31, height: 31 }} />
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-medium text-black tracking-[-0.01em] truncate">Clement Hugbo</span>
                  <span className="text-[11px] text-black/60 tracking-[-0.01em] truncate">Personal Pro Plan</span>
                </div>
                <Image src="/images/icon-chevron-down.svg" alt="" width={16} height={16} unoptimized className="ml-auto flex-shrink-0 opacity-40" style={{ width: 16, height: 16 }} />
              </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0" style={{ gap: SPACING }}>
              <div>
                <div className="flex items-center justify-between" style={{ padding: "4px 4px 12px 12px" }}>
                  <span className="text-[14px] font-medium text-black/80">Home</span>
                  <div
                    className={`flex items-center gap-[6px] px-[10px] py-[5px] rounded-[25px] transition-colors ${isActivated ? "bg-black/[0.03]" : "bg-black/[0.02]"}`}
                  >
                    <div
                      className={`w-[8px] h-[8px] rounded-full transition-colors ${isActivated ? "bg-[#76E6B1]" : "bg-black/20"}`}
                    />
                    <span className={`text-[10px] font-medium transition-colors ${isActivated ? "text-black/50" : "text-black/30"}`}>
                      {isActivated ? "WhatsApp Connected" : "Agent paused"}
                    </span>
                    <span className="w-px h-[10px] bg-black/10" />
                    <span className={`text-[10px] font-bold transition-colors ${isActivated ? "text-black/70" : "text-black/40"}`}>
                      +1 415 764 7332
                    </span>
                  </div>
                </div>
                <Separator />
              </div>

              <div className="flex flex-1 min-h-0" style={{ gap: SPACING }}>
                <div className="flex-1 flex flex-col min-w-0" style={{ gap: SPACING }}>
                  <div style={{ padding: "0 12px" }}>
                    <span className="text-[13px] font-medium text-black/80">Overview</span>
                  </div>

                  <motion.div
                    className="glass-card relative rounded-[18px] overflow-hidden"
                    style={{ padding: 12 }}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {isActivated && <div className="agent-glow" />}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex flex-col gap-[6px] overflow-hidden">
                        <span className="text-[12px] font-medium text-black/40">Current Status</span>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={isActivated ? "active" : "inactive"}
                            className="font-display text-[19px] leading-[0.95] tracking-[-0.04em] text-black/80"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          >
                            {isActivated ? "Agent is active" : "Agent is inactive"}
                          </motion.div>
                        </AnimatePresence>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={isActivated ? "active-desc" : "inactive-desc"}
                            className="text-[10px] text-black/50 max-w-[260px] leading-[1.4]"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0, transition: { duration: 0.25, delay: 0.2, ease: [0.22, 1, 0.36, 1] } }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          >
                            {isActivated
                              ? <>Your <span className="font-bold text-black/60">&apos;Professional&apos;</span> agent is currently handling incoming messages!</>
                              : "Turn on your agent to handle incoming messages automatically."}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsActivated(!isActivated)}
                        className="flex-shrink-0 rounded-full relative cursor-pointer transition-opacity hover:opacity-90"
                        style={{
                          width: TOGGLE_TRACK_W,
                          height: TOGGLE_TRACK_H,
                          background: "rgba(0, 0, 0, 0.04)",
                          border: "0.8px solid rgba(255,255,255,0.2)",
                        }}
                        aria-label={isActivated ? "Deactivate agent" : "Activate agent"}
                      >
                        <motion.div
                          className="absolute"
                          style={{
                            width: TOGGLE_THUMB_W,
                            height: TOGGLE_THUMB_H,
                            left: (TOGGLE_TRACK_W - TOGGLE_THUMB_W) / 2,
                            borderRadius: 16,
                            background: isActivated ? "#5ce3a2" : "rgba(0, 0, 0, 0.15)",
                            boxShadow: "0 3px 6px rgba(0, 0, 0, 0.09)",
                          }}
                          animate={{
                            bottom: isActivated ? THUMB_BOTTOM_ON : THUMB_BOTTOM_OFF,
                            y: isActivated ? [0, -1.5, 0] : 0,
                          }}
                          transition={{
                            bottom: { type: "spring", stiffness: 400, damping: 28 },
                            y: isActivated
                              ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
                              : { duration: 0 },
                          }}
                        />
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    className="glass-card rounded-[18px]"
                    style={{ padding: 12 }}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex flex-col" style={{ gap: 9 }}>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-black/40">Active persona</span>
                        <div className="flex items-center gap-[2px] px-[6px] py-[3px] rounded-[4px] bg-black/[0.04]">
                          <span className="text-[12px] font-bold text-[#478AED]">Professional</span>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M3 4L5 6L7 4" stroke="#478AED" strokeWidth="1.2" strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>
                      <Separator />
                      <StatRow label="Chats responded to" value="267" />
                      <Separator />
                      <StatRow label="Approved requests" value="11" />
                      <Separator />
                      <StatRow label="Denied requests" value="2" />
                      <Separator />
                      <StatRow label="Chats skipped" value="12" />
                    </div>
                  </motion.div>

                  <motion.div
                    className="glass-card rounded-[18px] flex flex-col items-end"
                    style={{ padding: 12, gap: SPACING }}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex items-center gap-[4px] px-[8px] rounded-[8px] bg-black/[0.04]">
                      <span className="text-[12px] font-semibold text-black/40">7d</span>
                      <span className="text-black/20 text-[8px]">|</span>
                      <div className="px-[4px] py-[2px] rounded-[6px] bg-white/30">
                        <span className="text-[12px] font-semibold text-[#478AED]">14d</span>
                      </div>
                      <span className="text-black/20 text-[8px]">|</span>
                      <span className="text-[12px] font-semibold text-black/40">30d</span>
                    </div>
                    <div className="w-full">
                      <BarChart />
                    </div>
                  </motion.div>
                </div>

                <div className="flex-shrink-0 flex flex-col" style={{ width: 320, gap: SPACING }}>
                  <div style={{ padding: "0 12px" }}>
                    <span className="text-[13px] font-medium text-black/80">Live Feed</span>
                  </div>
                  <div className="flex flex-col overflow-hidden flex-1" style={{ padding: "0 0", gap: 8 }}>
                    <FeedItem contact="+1 426 674 7463" time="Just now" title="Booking inquiry" description="Whatsy sent availability calendar, contact confirmed for Tuesday, at 2 PM PST" status="Replied" avatarSrc="/images/feed-avatar-1.png" delay={0.5} />
                    <FeedItem contact="Navi My Gee 🔥" time="2m ago" title="Chat skipped (family)" description="Rule #4 was triggered. Do not auto-reply to contacts labeled 'Family'." status="Skipped" avatarSrc="/images/feed-avatar-2.png" delay={0.6} />
                    <FeedItem contact="John Carrie" time="45m ago" title="Birth certificate" description="John Carrie requested your birth certificate to continue with the school application." status="Agent requested approval" avatarSrc="/images/feed-avatar-3.png" delay={0.7} />
                    <FeedItem contact="Annabel Emelumadu" time="1 hour ago" title="General inquiry" description="Whatsy provided office address and parking instructions" status="Replied" avatarSrc="/images/feed-avatar-4.png" delay={0.8} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
