"use client";

import { useEffect, useState } from "react";
import { useLottie } from "lottie-react";
import Link from "next/link";
import Image from "next/image";

interface LogoLottieProps {
  href?: string | null;
  className?: string;
  size?: "sm" | "md";
}

const sizes = { sm: { w: 90, h: 28 }, md: { w: 117, h: 37 } };

function LogoLottieInner({
  animationData,
  size,
  className,
}: {
  animationData: object;
  size: "sm" | "md";
  className: string;
}) {
  const { View, play, stop, goToAndStop, animationItem } = useLottie({
    animationData,
    loop: false,
    autoplay: false,
    style: { width: sizes[size].w, height: sizes[size].h },
  });

  useEffect(() => {
    if (animationItem) {
      const totalFrames = animationItem.getDuration(true) ?? 0;
      goToAndStop(totalFrames > 0 ? totalFrames - 1 : 0, true);
    }
  }, [animationItem, goToAndStop]);

  return (
    <div
      onMouseEnter={() => {
        goToAndStop(0, true);
        play();
      }}
      onMouseLeave={() => {
        stop();
        if (animationItem) {
          const totalFrames = animationItem.getDuration(true) ?? 0;
          goToAndStop(totalFrames > 0 ? totalFrames - 1 : 0, true);
        }
      }}
      className={className}
    >
      {View}
    </div>
  );
}

export default function LogoLottie({
  href,
  className = "",
  size = "md",
}: LogoLottieProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/loader.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(console.error);
  }, []);

  const content = animationData ? (
    <LogoLottieInner
      animationData={animationData}
      size={size}
      className={className}
    />
  ) : (
    <Image
      src="/images/logo-with-wordmark.svg"
      alt="Whatsy"
      width={sizes[size].w}
      height={sizes[size].h}
      className="h-auto"
      style={{ width: sizes[size].w, height: "auto" }}
    />
  );

  if (href != null) {
    return (
      <Link href={href} className="flex items-center">
        {content}
      </Link>
    );
  }

  return <div className="flex items-center">{content}</div>;
}
