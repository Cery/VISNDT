import type { Metadata } from "next";
import "./globals.css";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import Providers from "./providers";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, SITE_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} – 工业检测设备平台`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} – 工业检测设备平台`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: `${SITE_NAME} – 工业检测设备平台`,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="font-sans">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <PublicHeader />
          <main className="flex-1">{children}</main>
          <PublicFooter />
        </Providers>
      </body>
    </html>
  );
}