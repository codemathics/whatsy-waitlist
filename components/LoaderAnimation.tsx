"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLottie } from "lottie-react";

interface LoaderAnimationProps {
  onComplete: () => void;
}

function LottieLoaderView({
  animationData,
  onComplete,
}: {
  animationData: object;
  onComplete: () => void;
}) {
  const { View } = useLottie({
    animationData,
    loop: false,
    autoplay: true,
    onComplete,
    style: { width: 180, height: "auto" },
  });
  return View;
}

export default function LoaderAnimation({ onComplete }: LoaderAnimationProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    fetch("/loader.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(console.error);
  }, []);

  const handleComplete = useCallback(() => {
    setExiting(true);
    setTimeout(onComplete, 400);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: animationData ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {animationData && (
              <LottieLoaderView animationData={animationData} onComplete={handleComplete} />
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
