
import { AuthProvider } from '@/context/AuthContext'
import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/react"
export const metadata: Metadata = {
  title: 'Tu App',
  description: 'Descripción de tu app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <Analytics />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} 