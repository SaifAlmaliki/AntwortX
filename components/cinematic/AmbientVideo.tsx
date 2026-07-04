"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Background film clip that only decodes/plays while it's on screen. Two
 * full-screen videos autoplaying at once is a major source of mobile scroll
 * jank; an IntersectionObserver pauses whichever clip isn't visible. Under
 * prefers-reduced-motion the video stays paused and the poster shows.
 */
export function AmbientVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v || reduceMotion) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            v.play().catch(() => {
              /* autoplay can reject; poster remains */
            });
          } else if (!v.paused) {
            v.pause();
          }
        }
      },
      { threshold: 0.05 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduceMotion]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-hidden
      disablePictureInPicture
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
