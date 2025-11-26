import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LifeTrace Desktop Pet - 日程管理",
  description: "桌面桌宠日程管理应用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

