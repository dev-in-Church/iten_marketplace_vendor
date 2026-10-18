import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { VendorProviders } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Vendor | RunnerMKT",
  description: "RunnerMKT Vendor Dashboard - Manage your store",
  icons: {
    icon: "/images/icon.png",
  },
};

export default function VendorLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <VendorProviders>{children}</VendorProviders>
      </body>
    </html>
  );
}
