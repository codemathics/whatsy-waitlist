"use client";

import { motion } from "framer-motion";

interface LogoIconProps {
  size?: number;
  className?: string;
}

export default function LogoIcon({ size = 96, className = "" }: LogoIconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient
          id="logo-gradient"
          x1="100%"
          y1="0%"
          x2="0%"
          y2="100%"
          gradientTransform="rotate(-22)"
        >
          <stop offset="0%" stopColor="rgba(99, 255, 172, 1)" />
          <stop offset="47%" stopColor="rgba(42, 222, 232, 1)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 1)" />
        </linearGradient>
        <linearGradient id="purple-glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(136, 46, 253, 0.8)" />
          <stop offset="100%" stopColor="rgba(136, 46, 253, 0.4)" />
        </linearGradient>
        <filter id="inner-shadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur" />
          <feOffset dx="-4" dy="-10" result="offsetBlur" />
          <feComposite
            in="SourceGraphic"
            in2="offsetBlur"
            operator="over"
            result="composite"
          />
        </filter>
        <filter id="purple-blur">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>

      {/* main bubble shape */}
      <g transform="translate(10, 10)">
        {/* background gradient shape */}
        <path
          d="M38 0C58.9 0 76 17.1 76 38C76 52.5 68 65 56 71.5L62 76L48 76C46 76 44 75.8 42 75.5C40 75.8 38 76 36 76H22L28 71.5C16 65 8 52.5 8 38C8 17.1 22.1 0 38 0Z"
          fill="url(#logo-gradient)"
        />

        {/* purple glow blur behind */}
        <circle
          cx="38"
          cy="38"
          r="20"
          fill="url(#purple-glow)"
          filter="url(#purple-blur)"
          opacity="0.7"
        />

        {/* left eye */}
        <g transform="translate(24, 28)">
          <circle cx="5" cy="5" r="5" fill="#000" />
          <circle cx="7" cy="3" r="1.7" fill="rgba(255,255,255,0.8)" />
        </g>

        {/* right eye */}
        <g transform="translate(44, 28)">
          <circle cx="5" cy="5" r="5" fill="#000" />
          <circle cx="7" cy="3" r="1.7" fill="rgba(255,255,255,0.8)" />
        </g>

        {/* mouth line */}
        <line
          x1="36"
          y1="44"
          x2="40"
          y2="44"
          stroke="#fff"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* smile */}
        <path
          d="M30 50 Q38 56 46 50"
          fill="none"
          stroke="#000"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>
    </motion.svg>
  );
}
