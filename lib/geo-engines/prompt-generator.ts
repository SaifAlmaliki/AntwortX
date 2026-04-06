export class PromptGenerator {
  static generatePrompts(
    category: string,
    brandName: string,
    count: number = 10
  ): string[] {
    const templates = [
      `What are the best ${category}?`,
      `Which ${category} should I use?`,
      `Top ${category} recommendations`,
      `Compare ${category} options`,
      `What ${category} do experts recommend?`,
      `Best ${category} for small businesses`,
      `Best ${category} for enterprises`,
      `Affordable ${category} options`,
      `Most popular ${category}`,
      `What ${category} has the best features?`,
      `How to choose the right ${category}?`,
      `${category} reviews and ratings`,
      `Is ${brandName} a good ${category}?`,
      `Why use ${category}?`,
      `${category} vs alternatives`,
    ];

    return templates
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(count, templates.length));
  }
}
