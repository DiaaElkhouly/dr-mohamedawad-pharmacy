import { getProducts } from "@/lib/db";
import { Suspense } from "react";
import HomeContent from "./HomeContent";

export const metadata = {
  title: "صيدلية د / محمد عواد - صيدلية وعناية صحية",
  description:
    "صيدلية متخصصة في العناية بالبشرة والشعر والجسم. أسعار متميزة وجودة عالية. توصيل لجميع المناطق.",
  openGraph: {
    title: "صيدلية د / محمد عواد - صيدلية وعناية صحية",
    description:
      "صيدلية متخصصة في العناية بالبشرة والشعر والجسم. أسعار متميزة وجودة عالية.",
    type: "website",
  },
};

// Generate JSON-LD structured data for SEO
function generateProductSchema(products) {
  const siteUrl = "https://dr-mohamedawad-pharmacy.com";

  const productSchema = products.map((product) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description || `منتج ${product.name} من صيدلية د / محمد عواد`,
    image: product.image ? [product.image] : [],
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "EGP",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "صيدلية د / محمد عواد",
      },
    },
    ...(product.oldPrice && {
      priceSpecification: {
        "@type": "PriceSpecification",
        price: product.price,
        priceCurrency: "EGP",
        minPrice: product.price,
        maxPrice: product.oldPrice,
      },
    }),
  }));

  return productSchema;
}

// Pharmacy local business schema
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Pharmacy",
  name: "صيدلية د / محمد عواد",
  description: "صيدلية متخصصة في العناية بالبشرة والشعر والجسم",
  url: "https://dr-mohamedawad-pharmacy.com",
  logo: "https://dr-mohamedawad-pharmacy.com/logo.png",
  image: "https://dr-mohamedawad-pharmacy.com/bg-hero.jpg",
  address: {
    "@type": "PostalAddress",
    addressCountry: "EG",
    addressLocality: "مصر",
  },
  telephone: "+20-xxx-xxx-xxxx",
  priceRange: "$$",
  openingHours: "Mo-Su 00:00-24:00",
  servesCuisine: "Pharmacy",
  areaServed: {
    "@type": "Country",
    name: "مصر",
  },
  potentialAction: {
    "@type": "BuyAction",
    target: "https://dr-mohamedawad-pharmacy.com",
  },
};

export default function HomePage() {
  // Fetch products on the server for SEO
  let products = [];
  try {
    products = getProducts();
  } catch (error) {
    console.error("Error fetching products for SEO:", error);
  }

  const productSchema = generateProductSchema(products);
  const allSchemas = [localBusinessSchema, ...productSchema];

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(allSchemas) }}
      />
      <Suspense
        fallback={
          <div className="container-custom py-8">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          </div>
        }
      >
        <HomeContent initialProducts={products} />
      </Suspense>
    </>
  );
}
