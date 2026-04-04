"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import { ZEMPAR_AUDIT_URL_KEY } from "@/lib/website-url";

const inputClass =
  "zempar-input w-full px-4 py-2.5 rounded-xl focus-visible:ring-2 focus-visible:ring-cyan-400";

type ApiOk = { ok: true };
type ApiMailto = { ok: false; mailto: { to: string; subject: string; body: string } };
type ApiErr = { error: string; mailto?: { to: string; subject: string; body: string } };

export function GeoLeadSection() {
  const { t, direction } = useLanguage();
  const reduceMotion = useReducedMotion();
  const isRtl = direction === "rtl";

  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [hp, setHp] = useState("");
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
    setHp("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorKey("errorNetwork");

    try {
      const res = await fetch("/api/geo-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website, email, company, hp }),
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
        setErrorKey(
          data && typeof data === "object" && "error" in data && data.error === "validation"
            ? "errorValidation"
            : "errorSend"
        );
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
            className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl text-balance"
          >
            {t("geoLead.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
            {t("geoLead.subtitle")}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-cyan-200/90">
            {t("geoLead.highlight")}
          </p>
        </motion.div>

        <motion.div
          className="relative mx-auto max-w-xl"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.06 }}
        >
          <div className="card-surface section-glow rounded-2xl border-cyan-500/15 p-6 md:p-8">
            {status === "success" ? (
              <p
                className="text-center text-base leading-relaxed text-slate-200"
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
                      className="text-cyan-300 underline-offset-2 hover:underline"
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
                    className="mb-1 block text-sm font-medium text-slate-300"
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
                    className="mb-1 block text-sm font-medium text-slate-300"
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
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="geo-company"
                    className="mb-1 block text-sm font-medium text-slate-300"
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

                <p className="mb-5 text-xs leading-relaxed text-slate-500">
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
                    "btn-signal-primary w-full justify-center py-3 disabled:cursor-not-allowed disabled:opacity-60"
                  )}
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin text-[#060606]"
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
                    t("geoLead.submit")
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
