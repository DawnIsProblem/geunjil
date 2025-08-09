import {create} from 'zustand';

interface UserStore {
  user: null | {name: string; email: string; loginId: string; provider: string};
  setUser: (user: {
    id: number,
    name: string;
    email: string;
    loginId: string;
    provider: string;
  }) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>(set => ({
  user: null,
  setUser: user => set({user}),
  logout: () => set({user: null}),
}));
