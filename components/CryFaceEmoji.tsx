"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function CryFaceEmoji() {
  return (
    <motion.span
      className="inline-block align-middle ml-1 select-none"
      aria-hidden
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      style={{ lineHeight: 0 }}
    >
      <Image
        src="/images/cry-face.svg"
        alt=""
        width={24}
        height={24}
        className="inline-block align-middle"
        style={{ width: "1.2em", height: "1.2em", position: "relative", right: "12px", bottom: "2px" }}
        draggable={false}
      />
    </motion.span>
  );
}
