"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";

import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/language-context";
import { BRAND_EMAIL } from "@/lib/brand";
import { cn } from "@/lib/utils";

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
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const to = t("contact.emailAddress") || BRAND_EMAIL;
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
          <h1 className="font-display mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("contact.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("contact.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.1 }}
            className="lg:col-span-2"
          >
            <div className="card-surface section-glow rounded-2xl border-primary/15 p-6 md:p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name">{t("contact.name")}</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="min-h-11 rounded-xl"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email">{t("contact.email")}</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="min-h-11 rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="subject">{t("contact.subject")}</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    required
                    className="min-h-11 rounded-xl"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="message">{t("contact.message")}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="resize-none rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-signal-primary w-full justify-center py-3 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? `${t("contact.submit")}...` : t("contact.submit")}
                </button>
                {submitStatus === "success" && (
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-sm text-emerald-300"
                  >
                    {t("contact.success")}
                  </motion.div>
                )}
                {submitStatus === "error" && (
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-sm text-red-300"
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
            <div className="card-surface flex h-full flex-col rounded-2xl border-primary/15 p-6 md:p-8">
              <h3 className="font-display mb-6 text-center text-xl font-bold text-foreground">
                {t("contact.title")}
              </h3>

              <div className="flex flex-1 flex-col justify-center gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 rounded-full bg-primary/15 p-2">
                    <MapPin className="size-6 text-primary" aria-hidden />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-foreground">
                      {t("contact.address")}
                    </h4>
                    <p className="mt-1 text-muted-foreground">{t("contact.city")}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 rounded-full bg-primary/15 p-2">
                    <Mail className="size-6 text-primary" aria-hidden />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-foreground">
                      {t("contact.emailContact")}
                    </h4>
                    <p className="mt-1 text-muted-foreground">
                      {t("contact.emailAddress")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
