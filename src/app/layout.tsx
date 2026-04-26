import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import Script from "next/script";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "PrintMacha — Premium 3D Printed Art & Decor",
    template: "%s | PrintMacha",
  },
  description:
    "Discover premium 3D printed wall art, textured posters, F1 circuit art, and designer desk accessories. Handcrafted with precision for modern Indian spaces.",
  keywords: [
    "3D printed art",
    "wall art India",
    "3D textured posters",
    "F1 art",
    "desk accessories",
    "premium posters",
    "PrintMacha",
    "home decor India",
  ],
  authors: [{ name: "PrintMacha" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "PrintMacha",
    title: "PrintMacha — Premium 3D Printed Art & Decor",
    description:
      "Discover premium 3D printed wall art, textured posters, F1 circuit art, and designer desk accessories.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrintMacha — Premium 3D Printed Art & Decor",
    description:
      "Discover premium 3D printed wall art, textured posters, F1 circuit art, and designer desk accessories.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                  currency: 'INR'
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="bg-[var(--color-surface)] text-[var(--color-text-primary)] antialiased">
        <Providers>{children}</Providers>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-surface-elevated)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-inter)",
            },
          }}
        />
      </body>
    </html>
  );
}
