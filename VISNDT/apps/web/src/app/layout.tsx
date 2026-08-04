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
    <html lang="zh-CN">
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