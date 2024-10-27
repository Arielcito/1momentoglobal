'use client'

import { Inter } from "next/font/google"
import QueryProvider from '@/providers/QueryProvider'
import '@/css/style.css'

const inter = Inter({ subsets: ["latin"] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
