"use client";

import "../../css/animate.css";
import "../../css/style.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import ToasterContext from "../context/ToastContext";
import AuthProvider from "../context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AuthProvider>
            <ToasterContext />
            {children}
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
