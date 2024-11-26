import { useAuth } from '@/context/AuthContext';

export function useAuthFetch() {
  const { user, logout } = useAuth();

  const authFetch = async (url: string, options: RequestInit = {}) => {
    if (!user?.token) {
      throw new Error('No hay token disponible');
    }

    const headers = {
      'Authorization': `Bearer ${user.token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      logout();
      throw new Error('Sesión expirada');
    }

    return response;
  };

  return authFetch;
} 