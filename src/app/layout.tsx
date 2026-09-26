import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "CigarConnect — Where Cigars Connect | Cercle Privé & Haute Traçabilité",
  description:
    "CigarConnect est la première plateforme dédiée aux collections privées de cigares rares : conservation, traçabilité certifiée et échanges entre passionnés.",
  keywords: [
    "cigares de collection",
    "vitoles rares",
    "Cohiba Behike",
    "échange de cigares",
    "conservation humidor",
    "habanos",
    "where cigars connect",
  ],
  icons: {
    icon: "/assets/icon-cigarconnect-gold.svg",
    shortcut: "/assets/icon-gold.png",
    apple: "/assets/icon-gold.png",
  },
};

import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModal } from "@/components/profile/AuthModal";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" type="image/svg+xml" href="/assets/icon-cigarconnect-gold.svg" />
        <link rel="alternate icon" href="/assets/icon-gold.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;0,6..96,700;1,6..96,400&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root { --canvas: #F7F5F0; --ink: #211D19; }
              html, body { background-color: #F7F5F0 !important; color: #211D19; margin: 0; font-family: 'Outfit', -apple-system, sans-serif; }
              img { max-width: 100%; }
              @media (min-width: 640px) {
                .brand-logo img, header img, [title*="CigarConnect"] img { height: 44px !important; max-height: 48px !important; width: auto !important; object-fit: contain; }
              }
              @media (max-width: 639px) {
                .brand-logo img, header img, [title*="CigarConnect"] img { height: 32px !important; max-height: 34px !important; width: auto !important; object-fit: contain; }
              }
            `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-[#F4F0E7] text-[#241E1A] antialiased">
        <ScrollToTop />
        <ToastProvider>
          <AuthProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <AuthModal />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
