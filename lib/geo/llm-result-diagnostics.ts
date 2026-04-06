/**
 * Classify stored LLM query errors for admin diagnostics (no network).
 * Works on persisted `error` strings from geo-engines and llm-presence.
 */

export type LlmErrorCategory =
  | "none"
  | "missing_config"
  | "rate_limit"
  | "auth"
  | "api_error";

export interface LlmQueryDiagnostic {
  category: LlmErrorCategory;
  label: string;
}

export interface LlmEngineRunSummary {
  /** Highest-severity category seen across prompts */
  worstCategory: LlmErrorCategory;
  errorPromptCount: number;
  okPromptCount: number;
  /** Short line for badges */
  headline: string;
  /** One sentence for humans */
  detail: string;
}

const CATEGORY_LABELS: Record<LlmErrorCategory, string> = {
  none: "",
  missing_config: "API not configured",
  rate_limit: "Rate limited",
  auth: "Auth / API key",
  api_error: "API error",
};

export function categorizeLlmErrorMessage(message: string | undefined): LlmErrorCategory {
  if (!message || !message.trim()) {
    return "none";
  }
  const m = message.toLowerCase();
  if (
    /not configured|_api_key|api key not|missing.*key|environment variable/.test(m)
  ) {
    return "missing_config";
  }
  if (/429|rate limit|too many requests|resource_exhausted|quota/.test(m)) {
    return "rate_limit";
  }
  if (/401|403|unauthor|invalid.*key|permission denied|forbidden/.test(m)) {
    return "auth";
  }
  return "api_error";
}

export function llmQueryDiagnostic(error: string | undefined): LlmQueryDiagnostic {
  const category = categorizeLlmErrorMessage(error);
  return {
    category,
    label: category === "none" ? "" : CATEGORY_LABELS[category],
  };
}

/** Higher index = show this badge first when multiple error types appear. */
const CATEGORY_PRIORITY: Record<LlmErrorCategory, number> = {
  none: 0,
  api_error: 1,
  rate_limit: 2,
  auth: 3,
  missing_config: 4,
};

function pickWorse(a: LlmErrorCategory, b: LlmErrorCategory): LlmErrorCategory {
  return CATEGORY_PRIORITY[a] >= CATEGORY_PRIORITY[b] ? a : b;
}

export interface MinimalLlmResultRow {
  error?: string;
  mentioned: boolean;
  response?: string;
}

/**
 * Summarize one engine's run (all prompts) for card headers.
 */
export function summarizeLlmEngineRun(results: MinimalLlmResultRow[]): LlmEngineRunSummary {
  const n = results.length;
  let worst: LlmErrorCategory = "none";
  let errorPromptCount = 0;
  let okPromptCount = 0;

  for (const r of results) {
    const cat = categorizeLlmErrorMessage(r.error);
    if (cat !== "none") {
      errorPromptCount += 1;
      worst = pickWorse(worst, cat);
    } else {
      okPromptCount += 1;
    }
  }

  const allErrors = n > 0 && errorPromptCount === n;
  const allConfig =
    allErrors && results.every((r) => categorizeLlmErrorMessage(r.error) === "missing_config");
  const allRateLimit =
    allErrors && results.every((r) => categorizeLlmErrorMessage(r.error) === "rate_limit");

  let headline = "OK";
  let detail = "";

  if (n === 0) {
    headline = "No data";
    detail = "No per-prompt results were stored for this engine.";
  } else if (allConfig) {
    headline = CATEGORY_LABELS.missing_config;
    detail =
      "Every query failed because this provider’s API key or env configuration is missing.";
  } else if (allRateLimit) {
    headline = CATEGORY_LABELS.rate_limit;
    detail = "This provider rejected requests (rate limit or quota). Retry later or check billing.";
  } else if (allErrors && worst !== "none") {
    headline = CATEGORY_LABELS[worst];
    detail = `All ${n} queries failed (${errorPromptCount} errors). Expand below for messages.`;
  } else if (errorPromptCount > 0) {
    headline = "Partial failures";
    detail = `${errorPromptCount} of ${n} queries failed; others completed. See each prompt below.`;
  } else {
    const anyMention = results.some((r) => r.mentioned);
    const anyResponse = results.some((r) => (r.response ?? "").trim().length > 0);
    if (!anyResponse) {
      headline = "No response text stored";
      detail =
        "Queries may have run before response logging was enabled, or responses were empty.";
    } else if (!anyMention) {
      headline = "No brand mention";
      detail =
        "Queries succeeded, but the returned text did not match your brand name (substring check).";
    } else {
      headline = "Brand detected";
      detail = "At least one answer mentioned your brand.";
    }
  }

  return {
    worstCategory: worst,
    errorPromptCount,
    okPromptCount,
    headline,
    detail,
  };
}
