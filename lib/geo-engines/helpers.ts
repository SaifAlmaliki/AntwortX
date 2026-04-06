export function extractContext(text: string, brandName: string): string {
  const index = text.toLowerCase().indexOf(brandName.toLowerCase());
  if (index === -1) return '';
  const start = Math.max(0, index - 100);
  const end = Math.min(text.length, index + brandName.length + 100);
  return text.substring(start, end);
}

export function analyzeSentiment(text: string, brandName: string): 'positive' | 'neutral' | 'negative' {
  const positiveWords = ['best', 'great', 'excellent', 'recommend', 'top', 'leading', 'trusted', 'reliable', 'powerful', 'innovative', 'comprehensive', 'robust', 'intuitive', 'user-friendly'];
  const negativeWords = ['poor', 'bad', 'issues', 'problems', 'avoid', 'lacking', 'limited', 'outdated', 'slow', 'expensive', 'complex', 'confusing'];

  const lowerText = text.toLowerCase();
  const brandIndex = lowerText.indexOf(brandName.toLowerCase());
  if (brandIndex === -1) return 'neutral';

  const contextStart = Math.max(0, brandIndex - 200);
  const contextEnd = Math.min(lowerText.length, brandIndex + brandName.length + 200);
  const context = lowerText.substring(contextStart, contextEnd);

  const positiveCount = positiveWords.filter(word => context.includes(word)).length;
  const negativeCount = negativeWords.filter(word => context.includes(word)).length;

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

export function countMentions(text: string, brandName: string): number {
  const normalizedBrand = brandName.toLowerCase();
  const normalizedText = text.toLowerCase();
  const regex = new RegExp(normalizedBrand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  return (normalizedText.match(regex) || []).length;
}

export function checkCitation(text: string, websiteUrl: string): { cited: boolean; citationUrl?: string } {
  let domain: string;
  try {
    domain = new URL(websiteUrl).hostname.replace('www.', '');
  } catch {
    return { cited: false };
  }

  const normalizedText = text.toLowerCase();
  const cited = normalizedText.includes(domain) || normalizedText.includes(websiteUrl.toLowerCase());

  if (cited) {
    const urlRegex = /https?:\/\/[^\s\)]+/gi;
    const urls = text.match(urlRegex) || [];
    const citationUrl = urls.find(url =>
      url.toLowerCase().includes(domain) || url.toLowerCase().includes(websiteUrl.toLowerCase())
    );
    return { cited: true, citationUrl };
  }

  return { cited: false };
}
