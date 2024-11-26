
import { AuthProvider } from '@/context/AuthContext'
import type { Metadata } from 'next'

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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} 