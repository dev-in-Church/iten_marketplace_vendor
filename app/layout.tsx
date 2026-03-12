import type { ReactNode } from "react";
import { VendorProviders } from "./providers";
import "./globals.css";

export const metadata = {
  title: "Vendor | RunnerMKT",
  description: "RunnerMKT Vendor Dashboard - Manage your store",
  icons: {
    icon: "/images/icon.png",
  },
};

export default function VendorLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <VendorProviders>{children}</VendorProviders>
      </body>
    </html>
  );
}
