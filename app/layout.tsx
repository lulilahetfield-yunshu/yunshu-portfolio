import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "蓝飞然 | AIGC 动画创作者与三维视觉",
  description: "蓝飞然的 AIGC 动画、动画导演、商业影像与三维视觉作品集。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
