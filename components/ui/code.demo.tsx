"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, Box, Diamond } from "lucide-react";
import Link from "next/link";
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { Squares } from "@/components/ui/squares-background";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

function SplineViewportFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10",
        className
      )}
      aria-hidden
    >
      <Box className="h-16 w-16 text-primary/35 sm:h-20 sm:w-20" strokeWidth={1} />
    </div>
  );
}

export function SplineSceneBasic() {
  const { t, direction, locale } = useLanguage();
  const isRtl = direction === "rtl";
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [splineAllowed, setSplineAllowed] = useState(false);

  const preview = (locale as { heroAuditPreview?: { title?: string; bullets?: unknown; cta?: string } })
    .heroAuditPreview;
  const title = preview?.title ?? t("heroAuditPreview.title");
  const cta = preview?.cta ?? t("heroAuditPreview.cta");
  const bullets = Array.isArray(preview?.bullets)
    ? (preview!.bullets as string[]).filter((b) => typeof b === "string" && b.trim().length > 0)
    : [];

  useEffect(() => {
    if (reduceMotion) return;
    const root = viewportRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (hit) setSplineAllowed(true);
      },
      { root: null, rootMargin: "120px 0px", threshold: 0.06 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [reduceMotion]);

  const showSpline = !reduceMotion && splineAllowed;

  return (
    <Card
      ref={viewportRef}
      className="relative h-[400px] w-full overflow-hidden bg-black/[0.96] sm:h-[450px] md:h-[500px]"
    >
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />

      <div
        className={cn("flex h-full flex-col md:flex-row", isRtl && "md:flex-row-reverse")}
      >
        <div
          className={cn(
            "relative z-10 flex flex-1 flex-col justify-center gap-4 p-4 sm:p-6 md:p-8",
            isRtl ? "text-right" : ""
          )}
        >
          <p className="text-lg font-semibold leading-snug text-foreground sm:text-xl md:text-2xl">
            {title}
          </p>
          {bullets.length > 0 ? (
            <ul
              className={cn(
                "max-w-lg space-y-2.5 text-sm text-muted-foreground sm:text-base",
                isRtl ? "mr-0 ml-auto" : ""
              )}
            >
              {bullets.map((line) => (
                <li
                  key={line}
                  className={cn(
                    "flex gap-2.5 leading-relaxed",
                    isRtl ? "flex-row-reverse text-right" : ""
                  )}
                >
                  <Diamond
                    className="mt-1 h-3.5 w-3.5 shrink-0 text-primary/90"
                    aria-hidden
                    strokeWidth={2}
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <Link
            href="/#geo-lead"
            className={cn(
              "btn-signal-primary mt-1 inline-flex min-h-[44px] w-fit max-w-full items-center justify-center gap-2 px-5 py-3 text-center text-sm font-medium no-underline sm:text-base",
              isRtl ? "flex-row-reverse" : ""
            )}
          >
            <span className="text-balance">{cta}</span>
            {isRtl ? (
              <ArrowRight className="h-4 w-4 shrink-0 rotate-180" aria-hidden />
            ) : (
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            )}
          </Link>
        </div>

        <div className="relative h-[200px] flex-1 md:h-full">
          {showSpline ? (
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="h-full w-full"
            />
          ) : (
            <SplineViewportFallback className="h-full w-full" />
          )}
        </div>
      </div>
    </Card>
  );
}

export function SquaresDemo() {
  return (
    <div className="space-y-8">
      <div className="relative h-[400px] overflow-hidden rounded-lg bg-[#060606]">
        <Squares
          direction="diagonal"
          speed={0.5}
          squareSize={40}
          borderColor="#333"
          hoverFillColor="#222"
        />
      </div>
    </div>
  );
}
