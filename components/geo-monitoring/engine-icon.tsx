import { cn } from "@/lib/utils";
import { Bot, Search, Sparkles, MessageSquare } from "lucide-react";

const engineIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  openai: Bot,
  perplexity: Search,
  gemini: Sparkles,
  claude: MessageSquare,
};

const engineColors: Record<string, string> = {
  openai: "text-green-500",
  perplexity: "text-cyan-500",
  gemini: "text-blue-500",
  claude: "text-violet-500",
};

interface EngineIconProps {
  engine: string;
  className?: string;
}

export function EngineIcon({ engine, className }: EngineIconProps) {
  const Icon = engineIcons[engine] || Bot;
  const color = engineColors[engine] || "text-muted-foreground";

  return <Icon className={cn("size-4", color, className)} />;
}

export function EngineName({ engine }: { engine: string }) {
  const names: Record<string, string> = {
    openai: "OpenAI",
    perplexity: "Perplexity",
    gemini: "Gemini",
    claude: "Claude",
  };
  return names[engine] || engine;
}
