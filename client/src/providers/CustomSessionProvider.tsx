'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

interface CustomSessionProviderProps {
  children: ReactNode;
}

export function CustomSessionProvider({ children }: CustomSessionProviderProps) {
  return (
    <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
  );
} 