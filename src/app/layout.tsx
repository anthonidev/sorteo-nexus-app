import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "../styles/globals.css";
import { APP_CONFIG, COMPANY_INFO } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
  keywords: [
    "sorteo",
    "iPhone 16 Pro",
    "Nexus H. Global",
    "premio",
    "gratis",
    "Perú",
    "tecnología",
  ],
  authors: [{ name: COMPANY_INFO.name }],
  creator: COMPANY_INFO.name,
  publisher: COMPANY_INFO.name,
  openGraph: {
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    siteName: COMPANY_INFO.name,
    type: "website",
    locale: "es_PE",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
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
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
