'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  token: string;
  name?: string;
  image?: string;
  is_admin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshUserState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUserState = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener el estado del usuario');
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Error fetching user state:', error);
      return null;
    }
  };

  const refreshUserState = async () => {
    const token = Cookies.get('token');
    if (token && user) {
      const userData = await fetchUserState(token);
      if (userData) {
        setUser(prev => ({ ...prev, ...userData }));
      }
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get('token');
      const email = Cookies.get('userEmail');
      
      if (token && email) {
        const userData = await fetchUserState(token);
        if (userData) {
          setUser({ id: userData.id, token, email, ...userData });
        } else {
          // Si no se puede obtener el estado del usuario, limpiamos la sesión
          Cookies.remove('token');
          Cookies.remove('userEmail');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al iniciar sesión');
    }

    const data = await response.json();
    
    // Obtener el estado completo del usuario
    const userData = data.user;
    
    // Guardar en cookies en lugar de localStorage
    Cookies.set('token', data.token, { 
      secure: true,
      sameSite: 'strict',
      expires: 7 // expira en 7 días
    });
    Cookies.set('userEmail', email, { 
      secure: true,
      sameSite: 'strict',
      expires: 7
    });
    
    // Actualizar el estado con toda la información del usuario
    setUser({ id: userData.id, email, token: data.token, ...userData });
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('userEmail');
    setUser(null);
    router.push('/auth/signin');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUserState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
} 