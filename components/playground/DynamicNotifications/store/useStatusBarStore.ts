import { create } from 'zustand';

type StatusBarStore = {
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
};

export const useStatusBarStore = create<StatusBarStore>((set) => ({
  hidden: false,
  setHidden: (hidden) => set({ hidden }),
}));