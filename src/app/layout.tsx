import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://shibainupetshop.com"),
  title: {
    default: "Shiba Inu Pet Shop & Hotel | Davao City",
    template: "%s | Shiba Inu Pet Shop & Hotel",
  },
  description: "Shiba Inu Pet Shop & Hotel in Buhangin, Davao City offers 24/7 dog and cat boarding, pet grooming, Shiba Inu puppies and pet supplies.",
  openGraph: {
    type: "website",
    locale: "en_PH",
    siteName: "Shiba Inu Pet Shop & Hotel",
    images: [{ url: "/assets/photos/shiba-smile.webp", width: 1400, height: 933, alt: "A Shiba Inu at Shiba Inu Pet Shop & Hotel in Davao City" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-PH"><body>{children}</body></html>;
}
