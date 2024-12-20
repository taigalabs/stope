import { create } from "zustand";

export const useUserStore = create<AppState>((set) => ({
  username: "",
  password: "",
  signIn: (username: string, password: string) =>
    set(() => ({ username, password })),
}));

export interface AppState {
  username: string;
  password: string;
  signIn: (username: string, password: string) => void;
}
