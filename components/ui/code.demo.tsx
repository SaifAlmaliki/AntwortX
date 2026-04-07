"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Box } from "lucide-react";
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { Squares } from "@/components/ui/squares-background";
import { useLanguage } from "@/contexts/language-context";
import { BrandName } from "@/components/ui/BrandName";
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
  const { t, direction } = useLanguage();
  const isRtl = direction === "rtl";
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [splineAllowed, setSplineAllowed] = useState(false);

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
            "relative z-10 flex flex-1 flex-col justify-center p-4 sm:p-6 md:p-8",
            isRtl ? "text-right" : ""
          )}
        >
          <p className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
            {t("hero.title") || "Generative Engine Optimization"}
          </p>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
            {(() => {
              const description =
                t("hero.description") ||
                "Zempar pairs SEO with GEO so your brand is represented fairly when AI assistants surface recommendations.";
              if (description.includes("Zempar")) {
                const parts = description.split("Zempar");
                return (
                  <>
                    {parts[0]}
                    <BrandName size="sm" />
                    {parts[1]}
                  </>
                );
              }
              return description;
            })()}
          </p>
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
