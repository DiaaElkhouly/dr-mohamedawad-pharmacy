import { Cairo, Playfair_Display } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = "https://dr-mohamedawad-pharmacy.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "صيدلية د / محمد عواد - صيدلية وعناية صحية",
    template: "%s | صيدلية د / محمد عواد",
  },
  description:
    "صيدلية د / محمد عواد - صيدلية متخصصة في العناية بالبشرة والشعر والجسم. أسعار متميزة وجودة عالية. توصيل لجميع المناطق.",
  keywords: [
    "صيدلية",
    "د / محمد عواد",
    "دكتور محمد عواد",
    "عناية بالبشرة",
    "عناية بالشعر",
    "عناية بالجسم",
    "مكملات غذائية",
    "أطفال",
    "أدوات طبية",
    "فيتامنات",
    "Egypt pharmacy",
    "skin care",
    "hair care",
  ],
  authors: [{ name: "صيدلية د / محمد عواد" }],
  creator: "صيدلية د / محمد عواد",
  publisher: "صيدلية د / محمد عواد",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ar_AR",
    url: siteUrl,
    siteName: "صيدلية د / محمد عواد",
    title: "صيدلية د / محمد عواد - صيدلية وعناية صحية",
    description:
      "صيدلية متخصصة في العناية بالبشرة والشعر والجسم. أسعار متميزة وجودة عالية. توصيل لجميع المناطق.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "صيدلية د / محمد عواد",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "صيدلية د / محمد عواد - صيدلية وعناية صحية",
    description:
      "صيدلية متخصصة في العناية بالبشرة والشعر والجسم. أسعار متميزة وجودة عالية.",
    images: ["/og-image.jpg"],
    creator: "@dr_mohamedawad",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      ar: siteUrl,
    },
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
  themeColor: "#10b981",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#10b981",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="canonical" href={siteUrl} />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="صيدلية د/ محمد عواد" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${cairo.variable} ${playfair.variable} font-sans antialiased bg-gray-50 text-gray-800`}
      >
        {children}
      </body>
    </html>
  );
}
