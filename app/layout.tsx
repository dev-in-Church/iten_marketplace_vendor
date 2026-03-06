import type { ReactNode } from "react";
import { VendorProviders } from "./providers";
import "./globals.css";

export const metadata = {
  title: "Vendor - ItenGear",
  description: "ItenGear Vendor Dashboard - Manage your store",
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
