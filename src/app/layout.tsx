import { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "./context/AuthContext";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import "../css/style.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "1MomentGlobal",
  description: "Your app description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
