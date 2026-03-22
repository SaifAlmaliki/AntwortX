"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function NewsletterSubscribe() {
  const { t, direction } = useLanguage();
  const isRtl = direction === "rtl";
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error(t("newsletter.invalidEmail"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t("newsletter.success"));
        setEmail("");
      } else {
        toast.error(data.message || t("newsletter.error"));
      }
    } catch (error) {
      toast.error(t("newsletter.error"));
      console.error("Newsletter subscription error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-white mb-1 font-display">{t("newsletter.title")}</h3>
      <p className="text-slate-400 text-sm mb-4 leading-relaxed">{t("newsletter.description")}</p>

      <form
        onSubmit={handleSubmit}
        className={cn("flex flex-col sm:flex-row gap-2", isRtl ? "sm:flex-row-reverse" : "")}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("newsletter.placeholder")}
          className={cn(
            "flex-grow zempar-input px-3 py-2.5 text-sm",
            isRtl ? "text-right" : "text-left"
          )}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "btn-signal-primary shrink-0 px-5 py-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed",
            "flex items-center justify-center gap-2"
          )}
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-[#060606] border-t-transparent rounded-full animate-spin" />
          ) : isRtl ? (
            <>
              {t("newsletter.subscribe")}
              <Send size={16} />
            </>
          ) : (
            <>
              <Send size={16} />
              {t("newsletter.subscribe")}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
