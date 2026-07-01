import { site } from "@/data/site";

export function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? site.seo.siteUrl ?? "https://pousadaguimaraes.com.br";

  const lodgingBusiness = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: site.name,
    description: site.seo.description,
    url: baseUrl,
    telephone: site.contact.phone ?? undefined,
    email: site.contact.email ?? undefined,
    address: site.contact.address
      ? {
          "@type": "PostalAddress",
          streetAddress: site.contact.address,
        }
      : undefined,
    image: `${baseUrl}${site.heroImage.src}`,
    priceRange: "$$",
    amenityFeature: site.highlights.map((h) => ({
      "@type": "LocationFeatureSpecification",
      name: h.title,
      value: true,
    })),
    sameAs: site.contact.instagram ? [site.contact.instagram] : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingBusiness) }}
    />
  );
}
