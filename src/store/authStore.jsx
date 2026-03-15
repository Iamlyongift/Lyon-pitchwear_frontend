import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user:      null,
      token:     null,
      isAdmin:   false,

      setAuth: (user, token, isAdmin = false) => {
        localStorage.setItem('token', token);
        set({ user, token, isAdmin });
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAdmin: false });
      },
    }),
    { name: 'auth-storage' }
  )
);