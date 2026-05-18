import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Sahar | Essence of Night",
  description: "Luxury perfume e-commerce experience for Sahar, سهر, Essence of Night.",
  metadataBase: new URL("https://sahar.example.com")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          <AnalyticsTracker>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </AnalyticsTracker>
        </Providers>
      </body>
    </html>
  );
}
