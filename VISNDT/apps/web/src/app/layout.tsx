import type { Metadata } from "next";
import "./globals.css";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import Providers from "./providers";

export const metadata: Metadata = {
  title: {
    template: '%s',
    default: 'VISNDT – 工业检测设备平台',
  },
  description:
    'VISNDT是一个专业的工业无损检测设备平台——发现高精度内窥镜、检测相机和测量系统。',
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