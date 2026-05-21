import type { Metadata } from "next";
import "./globals.css";
import { cormorant, inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Sahar | Essence of Night",
  description: "Luxury perfume e-commerce experience for Sahar, سهر, Essence of Night.",
  metadataBase: new URL("https://sahar.example.com")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
