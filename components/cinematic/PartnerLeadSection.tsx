"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white/90 placeholder:text-white/30 focus-visible:border-[#00E676]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E676]/30";

export function PartnerLeadSection() {
  const reduceMotion = useReducedMotion();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    city: "",
    fleetSize: "",
  });
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = "Zempar partnership inquiry";
    const body = [
      `Name: ${formState.name}`,
      `Email: ${formState.email}`,
      `Company: ${formState.company}`,
      `Target city: ${formState.city}`,
      `Planned fleet size: ${formState.fleetSize}`,
    ].join("\n");
    window.location.href = `mailto:contact@zempar.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("success");
  };

  return (
    <section id="partner" className="relative py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,230,118,0.06), transparent 60%)",
        }}
        aria-hidden
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A0A0C]/90 p-8 backdrop-blur-sm sm:p-12"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#00E676]/80">
              Partner program
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white/90 sm:text-4xl">
              Launch your fleet with Zempar
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/50">
              Tell us about your market and fleet ambitions. Our team responds within 48 hours with
              a tailored launch plan — hardware, software, and ops support included.
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {[
                "Premium e-scooter hardware",
                "Rider app + operator dashboard",
                "Fleet telematics & compliance tooling",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-white/55 before:size-1.5 before:shrink-0 before:rounded-full before:bg-[#00E676]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {status === "success" ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#00E676]/20 bg-[#00E676]/5 p-8 text-center">
              <p className="font-display text-xl font-semibold text-white/90">Check your email client</p>
              <p className="mt-2 text-sm text-white/50">
                Complete sending the message and we&apos;ll be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="partner-name" className="mb-1.5 block text-xs font-medium text-white/45">
                    Full name
                  </label>
                  <input
                    id="partner-name"
                    required
                    className={inputClass}
                    value={formState.name}
                    onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="partner-email" className="mb-1.5 block text-xs font-medium text-white/45">
                    Work email
                  </label>
                  <input
                    id="partner-email"
                    type="email"
                    required
                    className={inputClass}
                    value={formState.email}
                    onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="partner-company" className="mb-1.5 block text-xs font-medium text-white/45">
                  Company
                </label>
                <input
                  id="partner-company"
                  required
                  className={inputClass}
                  value={formState.company}
                  onChange={(e) => setFormState((s) => ({ ...s, company: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="partner-city" className="mb-1.5 block text-xs font-medium text-white/45">
                    Target city
                  </label>
                  <input
                    id="partner-city"
                    required
                    className={inputClass}
                    value={formState.city}
                    onChange={(e) => setFormState((s) => ({ ...s, city: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="partner-fleet" className="mb-1.5 block text-xs font-medium text-white/45">
                    Planned fleet size
                  </label>
                  <input
                    id="partner-fleet"
                    placeholder="e.g. 500 scooters"
                    className={inputClass}
                    value={formState.fleetSize}
                    onChange={(e) => setFormState((s) => ({ ...s, fleetSize: e.target.value }))}
                  />
                </div>
              </div>
              <button
                type="submit"
                className={cn(
                  "btn-mobility-primary mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 sm:w-auto sm:self-start"
                )}
              >
                Request partnership
                <ArrowRight className="size-4" aria-hidden />
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  );
}
