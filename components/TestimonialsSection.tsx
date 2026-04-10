"use client";

import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { TESTIMONIALS, type Testimonial } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

const SECTION_BG = "bg-card/35";
const FADE_FROM = "from-card/35";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function TestimonialMarqueeCard({ item }: { item: Testimonial }) {
  return (
    <article
      className="w-[min(100vw-2rem,350px)] shrink-0 rounded-xl border border-border/60 bg-background/90 p-4 shadow-sm backdrop-blur-sm transition-colors hover:border-border"
      dir="ltr"
    >
      <div className="mb-4 flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className="h-4 w-4 shrink-0 fill-muted-foreground/90 text-transparent"
          />
        ))}
      </div>
      <p className="mb-6 line-clamp-6 text-start text-sm leading-relaxed text-foreground/90">
        {item.quote}
      </p>
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-accent/25 text-xs font-semibold text-foreground"
          aria-hidden
        >
          {initialsFromName(item.name)}
        </div>
        <div className="min-w-0 text-start">
          <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
          <p className="truncate text-sm text-muted-foreground">{item.role}</p>
        </div>
      </div>
    </article>
  );
}

function MarqueeRow({
  items,
  reverse,
}: {
  items: readonly Testimonial[];
  reverse: boolean;
}) {
  const doubled = [...items, ...items] as Testimonial[];
  return (
    <div className="relative overflow-hidden">
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r to-transparent sm:w-28",
          FADE_FROM
        )}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l to-transparent sm:w-28",
          FADE_FROM
        )}
        aria-hidden
      />
      <div
        className={cn(
          "flex w-max gap-6",
          reverse
            ? "animate-testimonial-marquee-reverse"
            : "animate-testimonial-marquee"
        )}
      >
        {doubled.map((item, index) => (
          <TestimonialMarqueeCard key={`${item.id}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const { t } = useLanguage();
  const mid = Math.ceil(TESTIMONIALS.length / 2);
  const rowA = TESTIMONIALS.slice(0, mid);
  const rowB = TESTIMONIALS.slice(mid);

  return (
    <section
      className={cn(
        "marketing-section mt-12 rounded-2xl border border-border/50 px-4 py-12 sm:px-6 md:mt-16 md:py-16 lg:mt-20",
        SECTION_BG
      )}
      aria-labelledby="testimonials-heading"
    >
      <ul className="sr-only">
        {TESTIMONIALS.map((item) => (
          <li key={item.id}>
            {item.name}, {item.role}: {item.quote}
          </li>
        ))}
      </ul>

      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center md:mb-10">
          <div className="mb-3 inline-flex rounded-full border border-border/60 bg-muted/35 px-4 py-1">
            <span className="text-xs text-muted-foreground">{t("testimonials.badge")}</span>
          </div>
          <h2
            id="testimonials-heading"
            className="mb-4 font-display text-4xl font-medium tracking-tight text-foreground md:text-5xl"
          >
            {t("testimonials.title")}
          </h2>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground">
            {t("testimonials.subtitle")}
          </p>
        </div>

        <div className="space-y-6" aria-hidden="true">
          <MarqueeRow items={rowA} reverse={false} />
          <MarqueeRow items={rowB} reverse />
        </div>
      </div>
    </section>
  );
}
