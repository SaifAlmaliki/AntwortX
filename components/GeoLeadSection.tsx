"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Diamond } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import { ZEMPAR_AUDIT_URL_KEY } from "@/lib/website-url";
import {
  GEO_LEAD_CATEGORY_MAX_LENGTH,
  isValidGeoLeadCategoryNormalized,
  normalizeGeoLeadCategoryInput,
} from "@/lib/validation/geo-lead-category";

const inputClass = "zempar-input w-full rounded-xl";

type ApiOk = { ok: true };
type ApiMailto = { ok: false; mailto: { to: string; subject: string; body: string } };
type ApiErr = { error: string; mailto?: { to: string; subject: string; body: string } };

export function GeoLeadSection() {
  const { t, direction, locale } = useLanguage();
  const reduceMotion = useReducedMotion();
  const isRtl = direction === "rtl";

  const whatYouGet = (locale as { geoLead?: { whatYouGet?: { title?: string; bullets?: unknown; privacy?: string } } })
    .geoLead?.whatYouGet;
  const whatYouGetTitle = whatYouGet?.title ?? t("geoLead.whatYouGet.title");
  const whatYouGetBullets = Array.isArray(whatYouGet?.bullets)
    ? (whatYouGet!.bullets as string[]).filter((b) => typeof b === "string" && b.trim().length > 0)
    : [];
  const whatYouGetPrivacy = whatYouGet?.privacy ?? t("geoLead.whatYouGet.privacy");

  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [hp, setHp] = useState("");
  const [categoryFieldError, setCategoryFieldError] = useState<
    "required" | "phrase" | null
  >(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [successKind, setSuccessKind] = useState<"smtp" | "mailto">("smtp");
  const [errorKey, setErrorKey] = useState<string>("errorNetwork");

  useEffect(() => {
    try {
      const pre = sessionStorage.getItem(ZEMPAR_AUDIT_URL_KEY);
      if (pre) {
        setWebsite(pre);
        sessionStorage.removeItem(ZEMPAR_AUDIT_URL_KEY);
      }
    } catch {
      /* private mode */
    }
  }, []);

  const resetForm = () => {
    setWebsite("");
    setEmail("");
    setCompany("");
    setCategory("");
    setCity("");
    setHp("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryFieldError(null);
    setErrorKey("errorNetwork");

    const categoryNormalized = normalizeGeoLeadCategoryInput(category);
    if (!categoryNormalized) {
      setCategoryFieldError("required");
      return;
    }
    if (!isValidGeoLeadCategoryNormalized(categoryNormalized)) {
      setCategoryFieldError("phrase");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/geo-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website,
          email,
          company,
          category: categoryNormalized,
          city,
          hp,
        }),
      });

      let data: ApiOk | ApiMailto | ApiErr;
      try {
        data = (await res.json()) as ApiOk | ApiMailto | ApiErr;
      } catch {
        setErrorKey("errorNetwork");
        setStatus("error");
        setTimeout(() => setStatus("idle"), 6000);
        return;
      }

      if (res.status === 400) {
        const apiErr =
          data && typeof data === "object" && "error" in data
            ? (data as ApiErr).error
            : undefined;
        if (apiErr === "category_required") {
          setCategoryFieldError("required");
          setStatus("idle");
          return;
        }
        if (apiErr === "category_invalid") {
          setCategoryFieldError("phrase");
          setStatus("idle");
          return;
        }
        setErrorKey(apiErr === "validation" ? "errorValidation" : "errorSend");
        setStatus("error");
        setTimeout(() => setStatus("idle"), 6000);
        return;
      }

      if ("ok" in data && data.ok === true) {
        setSuccessKind("smtp");
        setStatus("success");
        resetForm();
        setTimeout(() => setStatus("idle"), 12000);
        return;
      }

      if ("ok" in data && data.ok === false && "mailto" in data && data.mailto) {
        const { to, subject, body } = data.mailto;
        window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSuccessKind("mailto");
        setStatus("success");
        resetForm();
        setTimeout(() => setStatus("idle"), 12000);
        return;
      }

      if (res.status === 500 && data && typeof data === "object" && "mailto" in data && data.mailto) {
        const { to, subject, body } = data.mailto;
        window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSuccessKind("mailto");
        setStatus("success");
        resetForm();
        setTimeout(() => setStatus("idle"), 12000);
        return;
      }

      setErrorKey("errorSend");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 6000);
    } catch {
      setErrorKey("errorNetwork");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 6000);
    }
  };

  return (
    <section
      id="geo-lead"
      className="marketing-section scroll-mt-24 py-12 md:py-20"
      aria-labelledby="geo-lead-heading"
    >
      <div className={cn(isRtl && "rtl")}>
        <motion.div
          className="mb-10 text-center md:mb-12"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h2
            id="geo-lead-heading"
            className="font-display text-balance text-3xl font-bold text-foreground sm:text-4xl md:text-5xl"
          >
            {t("geoLead.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {t("geoLead.subtitle")}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-primary/90">
            {t("geoLead.highlight")}
          </p>
        </motion.div>

        <motion.div
          className={cn(
            "relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-start lg:gap-10",
            isRtl && "rtl"
          )}
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.06 }}
        >
          {status !== "success" && whatYouGetBullets.length > 0 ? (
            <div
              className={cn(
                "card-surface section-glow rounded-2xl border-primary/15 p-6 md:p-8",
                "order-2 lg:order-1"
              )}
            >
              <h3 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                {whatYouGetTitle}
              </h3>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {whatYouGetBullets.map((line) => (
                  <li
                    key={line}
                    className={cn("flex gap-3", isRtl ? "flex-row-reverse text-right" : "")}
                  >
                    <Diamond
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary/90"
                      aria-hidden
                      strokeWidth={2}
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-muted-foreground/90 sm:text-sm">
                {whatYouGetPrivacy}
              </p>
            </div>
          ) : null}

          <div
            className={cn(
              "order-1 min-w-0 lg:order-2",
              status === "success" ? "mx-auto max-w-xl lg:col-span-2" : "max-w-xl lg:max-w-none"
            )}
          >
            <div className="card-surface section-glow rounded-2xl border-primary/15 p-6 md:p-8">
            {status === "success" ? (
              <p
                className="text-center text-base leading-relaxed text-foreground/95"
                role="status"
              >
                {successKind === "smtp"
                  ? t("geoLead.successSmtp")
                  : t("geoLead.successMailto")}
                {successKind === "mailto" ? (
                  <>
                    {" "}
                    <a
                      href={`mailto:${t("contact.emailAddress")}`}
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      {t("contact.emailAddress")}
                    </a>
                  </>
                ) : null}
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="geo-website"
                    className="mb-1 block text-sm font-medium text-muted-foreground"
                  >
                    {t("geoLead.websiteLabel")}
                  </label>
                  <input
                    id="geo-website"
                    type="text"
                    name="website"
                    inputMode="url"
                    autoComplete="url"
                    required
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder={t("geoLead.websitePlaceholder")}
                    className={inputClass}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="geo-email"
                    className="mb-1 block text-sm font-medium text-muted-foreground"
                  >
                    {t("geoLead.emailLabel")}
                  </label>
                  <input
                    id="geo-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("geoLead.emailPlaceholder")}
                    className={inputClass}
                    aria-describedby="geo-email-hint"
                  />
                  <p
                    id="geo-email-hint"
                    className="mt-1 text-xs text-muted-foreground"
                  >
                    {t("geoLead.emailHint")}
                  </p>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="geo-company"
                    className="mb-1 block text-sm font-medium text-muted-foreground"
                  >
                    {t("geoLead.companyLabel")}
                  </label>
                  <input
                    id="geo-company"
                    type="text"
                    name="company"
                    autoComplete="organization"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={t("geoLead.companyPlaceholder")}
                    className={inputClass}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="geo-category"
                    className="mb-1 block text-sm font-medium text-muted-foreground"
                  >
                    {t("geoLead.categoryLabel")}
                  </label>
                  <input
                    id="geo-category"
                    type="text"
                    name="category"
                    aria-required="true"
                    aria-invalid={categoryFieldError != null}
                    aria-describedby={
                      categoryFieldError ? "geo-category-error" : "geo-category-hint"
                    }
                    maxLength={GEO_LEAD_CATEGORY_MAX_LENGTH}
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setCategoryFieldError(null);
                    }}
                    placeholder={t("geoLead.categoryPlaceholder")}
                    className={cn(
                      inputClass,
                      categoryFieldError && "border-amber-500/80 ring-1 ring-amber-500/40"
                    )}
                  />
                  <p
                    id="geo-category-hint"
                    className={cn(
                      "mt-1 text-xs text-muted-foreground",
                      categoryFieldError && "sr-only"
                    )}
                  >
                    {t("geoLead.categoryHint")}
                  </p>
                  {categoryFieldError ? (
                    <p
                      id="geo-category-error"
                      className="mt-1 text-sm text-amber-400"
                      role="alert"
                    >
                      {categoryFieldError === "required"
                        ? t("geoLead.errorCategoryRequired")
                        : t("geoLead.errorCategoryPhrase")}
                    </p>
                  ) : null}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="geo-city"
                    className="mb-1 block text-sm font-medium text-muted-foreground"
                  >
                    {t("geoLead.cityLabel")}
                  </label>
                  <input
                    id="geo-city"
                    type="text"
                    name="city"
                    autoComplete="address-level2"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={t("geoLead.cityPlaceholder")}
                    className={inputClass}
                  />
                </div>

                <div
                  className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
                  aria-hidden="true"
                >
                  <input
                    id="geo-hp"
                    name="hp"
                    type="text"
                    tabIndex={-1}
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    autoComplete="off"
                  />
                </div>

                <p className="mb-5 text-xs leading-relaxed text-muted-foreground/90">
                  {t("geoLead.consent")}
                </p>

                {status === "error" ? (
                  <p className="mb-4 text-sm text-amber-400" role="alert">
                    {errorKey === "errorValidation"
                      ? t("geoLead.errorValidation")
                      : errorKey === "errorSend"
                        ? t("geoLead.errorSend")
                        : t("geoLead.errorNetwork")}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className={cn(
                    "btn-signal-primary flex w-full items-center justify-center gap-2 py-3 disabled:cursor-not-allowed disabled:opacity-60",
                    isRtl ? "flex-row-reverse" : ""
                  )}
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin text-primary-foreground"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {t("geoLead.submitting")}
                    </span>
                  ) : (
                    <>
                      <span>{t("geoLead.submit")}</span>
                      {isRtl ? (
                        <ArrowRight className="h-4 w-4 shrink-0 rotate-180" aria-hidden />
                      ) : (
                        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                      )}
                    </>
                  )}
                </button>
                <p className="mt-3 text-center text-xs text-muted-foreground sm:text-sm">
                  {t("geoLead.reassurance")}
                </p>
              </form>
            )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
