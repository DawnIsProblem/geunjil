import { create } from 'zustand'

interface UserStore {
    user: null | { name: string; email: string};
    setUser: (user: { name: string; email: string }) => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
}));