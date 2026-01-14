import { AppShell } from "@/components/layout/AppShell";
import { OutletProvider } from "@/context/OutletContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Restaurant Admin",
  description: "Created by WYZARD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          "antialiased min-h-screen bg-[#e9e9ff]",
        ].join(" ")}
      >
        <OutletProvider>
          <AppShell>{children}</AppShell>
        </OutletProvider>
      </body>
    </html>
  );
}
