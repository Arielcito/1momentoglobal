"use client";

import "../../css/animate.css";
import "../../css/style.css";
import type React from "react";
import { useEffect, useState } from "react";
import PreLoader from "@/components/PreLoader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";
import AuthProvider from "../context/AuthContext";
import ToasterContext from "../context/ToastContext";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Metadata } from "next";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "@/components/ui/toaster";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <SessionProvider>
          <AuthProvider>
            <NextTopLoader
              color="#006BFF"
              crawlSpeed={300}
              showSpinner={false}
              shadow="none"
            />
            <ThemeProvider
              enableSystem={false}
              attribute="class"
              defaultTheme="light"
            >
              {loading ? (
                <PreLoader />
              ) : (
                <>
                  <ToasterContext />
                  <main>{children}</main>
                  <ScrollToTop />
                </>
              )}
            </ThemeProvider>
            <Toaster />
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
