import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shiba Inu Pet Shop & Hotel",
  description: "Shiba Inu Pet Shop & Hotel in Buhangin, Davao City. Pet hotel, grooming, puppies and pet supplies.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-PH"><body>{children}</body></html>;
}
