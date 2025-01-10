import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.scss";
import { TopLevelContext } from "@/components/top_level_context/top_level_context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "STO Privacy Extension",
  description: "STOPE: Security Token Offerings Privacy Extension",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <TopLevelContext>{children}</TopLevelContext>
      </body>
    </html>
  );
}
