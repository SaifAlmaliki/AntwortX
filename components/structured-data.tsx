import arLocale from "@/locales/ar.json";
import {
  BRAND_EMAIL,
  BRAND_NAME_AR,
  BRAND_NAME_EN,
  DEFAULT_DESCRIPTION_AR,
} from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";

export function StructuredData() {
  const base = getSiteUrl();
  const orgId = `${base}/#organization`;
  const websiteId = `${base}/#website`;

  const faqItems = (arLocale.cinematic?.faq?.items ?? []) as {
    q: string;
    a: string;
  }[];

  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": orgId,
      name: BRAND_NAME_AR,
      alternateName: BRAND_NAME_EN,
      url: base,
      email: BRAND_EMAIL,
      description: DEFAULT_DESCRIPTION_AR,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      name: BRAND_NAME_AR,
      url: base,
      description: DEFAULT_DESCRIPTION_AR,
      publisher: { "@id": orgId },
      inLanguage: "ar-IQ",
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: BRAND_NAME_AR,
      url: base,
      description: DEFAULT_DESCRIPTION_AR,
      provider: { "@id": orgId },
      areaServed: "IQ",
      serviceType: "Shared electric scooter rides",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
  ];

  return (
    <>
      {graph.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </>
  );
}
