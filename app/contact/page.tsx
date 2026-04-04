"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

const inputClass =
  "zempar-input w-full px-4 py-2.5 rounded-xl focus-visible:ring-2 focus-visible:ring-cyan-400";

export default function ContactPage() {
  const { t, direction } = useLanguage();
  const isRtl = direction === "rtl";
  const reduceMotion = useReducedMotion();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const to = t("contact.emailAddress");
      const subject = formState.subject;
      const body = `Name: ${formState.name}\nEmail: ${formState.email}\n\n${formState.message}`;
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setSubmitStatus("success");
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error opening mail client:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  return (
    <div className={cn("marketing-section min-h-screen pb-16 pt-24", isRtl ? "rtl" : "")}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl mb-4 tracking-tight">
            {t("contact.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">{t("contact.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.1 }}
            className="lg:col-span-2"
          >
            <div className="card-surface section-glow rounded-2xl border-cyan-500/15 p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-300">
                      {t("contact.name")}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-300">
                      {t("contact.email")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="subject" className="mb-1 block text-sm font-medium text-slate-300">
                    {t("contact.subject")}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-300">
                    {t("contact.message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className={cn(inputClass, "resize-none")}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "btn-signal-primary w-full justify-center py-3 disabled:cursor-not-allowed disabled:opacity-60"
                    )}
                  >
                    {isSubmitting ? (
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
                        {t("contact.submit")}...
                      </span>
                    ) : (
                      t("contact.submit")
                    )}
                  </button>
                </div>
                {submitStatus === "success" && (
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-sm text-emerald-300"
                  >
                    {t("contact.success")}
                  </motion.div>
                )}
                {submitStatus === "error" && (
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-sm text-red-300"
                  >
                    {t("contact.error")}
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.2 }}
            className="lg:col-span-1"
          >
            <div className="card-surface flex h-full flex-col rounded-2xl border-cyan-500/15 p-6 md:p-8">
              <h3 className="font-display mb-6 text-center text-xl font-bold text-white">{t("contact.title")}</h3>

              <div className="flex flex-1 flex-col justify-center space-y-8">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 rounded-full bg-cyan-400/15 p-2">
                    <MapPin className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">{t("contact.address")}</h4>
                    <p className="mt-1 text-slate-400">{t("contact.city")}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 rounded-full bg-cyan-400/15 p-2">
                    <Phone className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">{t("contact.phone")}</h4>
                    <p className="mt-1 text-slate-400">{t("contact.phoneNumber")}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 rounded-full bg-cyan-400/15 p-2">
                    <Mail className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">{t("contact.emailContact")}</h4>
                    <p className="mt-1 text-slate-400">{t("contact.emailAddress")}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
