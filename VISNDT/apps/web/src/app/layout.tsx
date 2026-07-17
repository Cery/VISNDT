import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VISNDT",
  description: "VISNDT Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}