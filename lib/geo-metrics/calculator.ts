export interface CalculatedMetrics {
  geoScore: number;
  shareOfVoice: number;
  citationRate: number;
  brandSentiment: 'positive' | 'neutral' | 'negative';
  promptCoverage: number;
  snippetFrequency: number;
  brandAuthority: number;
  zeroClickPresence: number;
}

export class MetricsCalculator {
  static calculate(
    engineResults: Record<string, any>,
    promptResults: any[],
    competitors?: string[]
  ): CalculatedMetrics {
    return {
      geoScore: this.calculateGEOScore(engineResults, promptResults),
      shareOfVoice: this.calculateShareOfVoice(engineResults, competitors),
      citationRate: this.calculateCitationRate(engineResults, promptResults),
      brandSentiment: this.calculateSentiment(engineResults),
      promptCoverage: this.calculatePromptCoverage(promptResults),
      snippetFrequency: this.calculateSnippetFrequency(engineResults),
      brandAuthority: this.calculateBrandAuthority(engineResults),
      zeroClickPresence: this.calculateZeroClickPresence(engineResults, promptResults),
    };
  }

  private static calculateGEOScore(
    engineResults: Record<string, any>,
    promptResults: any[]
  ): number {
    const weights = {
      mentionRate: 0.25,
      citationRate: 0.30,
      sentimentScore: 0.20,
      promptCoverage: 0.15,
      authorityScore: 0.10,
    };

    const engines = Object.keys(engineResults);
    if (engines.length === 0) return 0;

    let totalScore = 0;

    engines.forEach(engine => {
      const result = engineResults[engine];
      const mentionRate = result.mentioned ? 100 : 0;
      const citationRate = result.cited ? 100 : 0;
      const sentimentScore = result.sentiment === 'positive' ? 100 :
                            result.sentiment === 'neutral' ? 50 : 0;
      const promptCoverageScore = promptResults.length > 0
        ? (promptResults.filter(p => p.engines?.[engine]?.mentioned).length / promptResults.length) * 100
        : 0;
      const authorityScore = result.authorityScore || 50;

      const engineScore =
        mentionRate * weights.mentionRate +
        citationRate * weights.citationRate +
        sentimentScore * weights.sentimentScore +
        promptCoverageScore * weights.promptCoverage +
        authorityScore * weights.authorityScore;

      totalScore += engineScore;
    });

    return Math.round((totalScore / engines.length) * 10) / 10;
  }

  private static calculateShareOfVoice(
    engineResults: Record<string, any>,
    competitors?: string[]
  ): number {
    const engines = Object.keys(engineResults);
    let brandMentions = 0;

    engines.forEach(engine => {
      const result = engineResults[engine];
      if (result.mentioned) {
        brandMentions += result.mentions || 1;
      }
    });

    if (!competitors || competitors.length === 0) {
      return brandMentions > 0 ? 100 : 0;
    }

    return Math.min(100, Math.round((brandMentions / Math.max(1, brandMentions + competitors.length)) * 100));
  }

  private static calculateCitationRate(
    engineResults: Record<string, any>,
    promptResults: any[]
  ): number {
    const engines = Object.keys(engineResults);
    let totalPrompts = 0;
    let citedPrompts = 0;

    promptResults.forEach(prompt => {
      engines.forEach(engine => {
        totalPrompts++;
        if (prompt.engines?.[engine]?.cited) {
          citedPrompts++;
        }
      });
    });

    return totalPrompts > 0 ? Math.round((citedPrompts / totalPrompts) * 100) : 0;
  }

  private static calculateSentiment(
    engineResults: Record<string, any>
  ): 'positive' | 'neutral' | 'negative' {
    const engines = Object.keys(engineResults);
    let positive = 0;
    let neutral = 0;
    let negative = 0;

    engines.forEach(engine => {
      const sentiment = engineResults[engine]?.sentiment;
      if (sentiment === 'positive') positive++;
      else if (sentiment === 'negative') negative++;
      else neutral++;
    });

    if (positive > negative && positive > neutral) return 'positive';
    if (negative > positive && negative > neutral) return 'negative';
    return 'neutral';
  }

  private static calculatePromptCoverage(
    promptResults: any[]
  ): number {
    if (promptResults.length === 0) return 0;
    const covered = promptResults.filter(p => {
      const engines = Object.keys(p.engines || {});
      return engines.some(engine => p.engines[engine]?.mentioned);
    }).length;
    return Math.round((covered / promptResults.length) * 100);
  }

  private static calculateSnippetFrequency(
    engineResults: Record<string, any>
  ): number {
    const engines = Object.keys(engineResults);
    let totalSnippets = 0;

    engines.forEach(engine => {
      const snippets = engineResults[engine]?.snippets || [];
      totalSnippets += snippets.length;
    });

    return engines.length > 0 ? Math.round((totalSnippets / engines.length) * 10) / 10 : 0;
  }

  private static calculateBrandAuthority(
    engineResults: Record<string, any>
  ): number {
    const engines = Object.keys(engineResults);
    let authorityScore = 0;

    engines.forEach(engine => {
      const result = engineResults[engine];
      if (result.cited) authorityScore += 30;
      if (result.sentiment === 'positive') authorityScore += 20;
    });

    return Math.min(100, authorityScore);
  }

  private static calculateZeroClickPresence(
    engineResults: Record<string, any>,
    promptResults: any[]
  ): number {
    const engines = Object.keys(engineResults);
    let mentionedWithoutCitation = 0;
    let totalMentions = 0;

    promptResults.forEach(prompt => {
      engines.forEach(engine => {
        const result = prompt.engines?.[engine];
        if (result?.mentioned) {
          totalMentions++;
          if (!result.cited) {
            mentionedWithoutCitation++;
          }
        }
      });
    });

    return totalMentions > 0
      ? Math.round((mentionedWithoutCitation / totalMentions) * 100)
      : 0;
  }
}
