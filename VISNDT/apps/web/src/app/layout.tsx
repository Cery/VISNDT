import type { Metadata } from "next";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import Providers from "./providers";

export const metadata: Metadata = {
  title: {
    template: '%s',
    default: 'VISNDT – Industrial Inspection Equipment Platform',
  },
  description:
    'VISNDT is a professional platform for industrial non-destructive testing equipment — discover high-precision endoscopes, inspection cameras, and measurement systems.',
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