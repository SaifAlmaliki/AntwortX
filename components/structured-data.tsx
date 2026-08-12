import arLocale from "@/locales/ar.json";
import { getSiteUrl } from "@/lib/site-url";

const FACEBOOK = "https://www.facebook.com/profile.php?id=61574206222119";
const INSTAGRAM = "https://www.instagram.com/zempar/";
const LINKEDIN_COMPANY = "https://www.linkedin.com/company/106535449/";

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
      name: "تجول",
      alternateName: "Zempar",
      url: base,
      email: "contact@zempar.com",
      description: arLocale.home.description,
      sameAs: [FACEBOOK, INSTAGRAM, LINKEDIN_COMPANY],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      name: "تجول",
      url: base,
      description: arLocale.home.description,
      publisher: { "@id": orgId },
      inLanguage: "ar-IQ",
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "تجول",
      url: base,
      description: arLocale.home.description,
      provider: { "@id": orgId },
      areaServed: "IQ",
      serviceType: "Shared e-scooter rides for urban commuters — clean electric mobility",
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
