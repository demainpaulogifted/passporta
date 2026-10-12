import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PassPorta — Your Passport Journey, Made Easier",
  description:
    "Understand the Nigerian passport application process with practical guidance and optional assistance.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}