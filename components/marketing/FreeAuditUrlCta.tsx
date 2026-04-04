"use client";

import { useId, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { normalizeWebsiteUrl, ZEMPAR_AUDIT_URL_KEY } from "@/lib/website-url";
import { cn } from "@/lib/utils";

const inputClass =
  "zempar-input w-full min-w-0 flex-1 px-4 py-2.5 rounded-xl focus-visible:ring-2 focus-visible:ring-cyan-400";

type Props = {
  className?: string;
  /** Dark band variant: slightly tighter contrast */
  variant?: "default" | "onDark";
};

export function FreeAuditUrlCta({ className, variant = "default" }: Props) {
  const id = useId();
  const fieldId = `free-audit-url-${id}`;
  const errorId = `free-audit-url-error-${id}`;
  const { t, direction } = useLanguage();
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);

  const go = () => {
    const normalized = normalizeWebsiteUrl(url);
    if (!normalized) {
      setError(true);
      return;
    }
    setError(false);
    try {
      sessionStorage.setItem(ZEMPAR_AUDIT_URL_KEY, normalized);
    } catch {
      /* ignore quota / private mode */
    }
    document.getElementById("geo-lead")?.scrollIntoView({ behavior: "smooth" });
    requestAnimationFrame(() => {
      document.getElementById("geo-website")?.focus();
    });
  };

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 sm:p-6",
        variant === "onDark"
          ? "border-white/10 bg-black/30"
          : "border-cyan-500/15 bg-white/[0.02] card-surface",
        className
      )}
    >
      <p
        className={cn(
          "font-display text-lg font-semibold text-white sm:text-xl",
          direction === "rtl" ? "text-right" : "text-left"
        )}
      >
        {t("freeAuditCta.heading")}
      </p>
      <p
        className={cn(
          "mt-2 text-sm leading-relaxed text-slate-400 sm:text-base",
          direction === "rtl" ? "text-right" : "text-left"
        )}
      >
        {t("freeAuditCta.description")}
      </p>
      <div
        className={cn(
          "mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch",
          direction === "rtl" && "sm:flex-row-reverse"
        )}
      >
        <label className="sr-only" htmlFor={fieldId}>
          {t("freeAuditCta.urlLabel")}
        </label>
        <input
          id={fieldId}
          type="text"
          name="business-url"
          inputMode="url"
          autoComplete="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              go();
            }
          }}
          placeholder={t("freeAuditCta.urlPlaceholder")}
          className={inputClass}
          aria-invalid={error}
          aria-describedby={error ? errorId : undefined}
        />
        <button
          type="button"
          onClick={go}
          className={cn(
            "btn-signal-primary inline-flex shrink-0 items-center justify-center gap-2 px-5 py-3 whitespace-nowrap sm:min-w-[12rem]",
            direction === "rtl" && "flex-row-reverse"
          )}
        >
          {t("freeAuditCta.button")}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-amber-400" role="alert">
          {t("freeAuditCta.errorInvalidUrl")}
        </p>
      ) : null}
    </div>
  );
}
