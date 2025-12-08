import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AuthProvider } from "@/contexts/auth.context";
import { OrganizationProvider } from "@/contexts/organization.context";

export const metadata: Metadata = {
  title: "SaaS Factory - Generate Landing Pages Instantly",
  description: "Transform your SaaS ideas into beautiful landing pages automatically",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <OrganizationProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </OrganizationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}