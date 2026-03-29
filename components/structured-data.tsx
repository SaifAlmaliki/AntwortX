import enLocale from "@/locales/en.json";
import { getSiteUrl } from "@/lib/site-url";

const FACEBOOK = "https://www.facebook.com/profile.php?id=61574206222119";
const INSTAGRAM = "https://www.instagram.com/zempar/";
const LINKEDIN_COMPANY = "https://www.linkedin.com/company/106535449/";

export function StructuredData() {
  const base = getSiteUrl();
  const orgId = `${base}/#organization`;
  const websiteId = `${base}/#website`;

  const faqQuestions = (enLocale.faq?.questions ?? []) as {
    question: string;
    answer: string;
  }[];

  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": orgId,
      name: "Zempar",
      url: base,
      email: "contact@zempar.com",
      description: enLocale.hero.description,
      sameAs: [FACEBOOK, INSTAGRAM, LINKEDIN_COMPANY],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      name: "Zempar",
      url: base,
      description: enLocale.home.description,
      publisher: { "@id": orgId },
      inLanguage: "en",
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "Zempar",
      url: base,
      description: enLocale.hero.description,
      provider: { "@id": orgId },
      areaServed: "Worldwide",
      serviceType:
        "Generative Engine Optimization (GEO) consulting, SEO alignment, and LLM visibility strategy",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqQuestions.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
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
