import { create } from "zustand";

interface Store {
  rank: number;
  setRank: (item: number) => void;
  getRank: () => number;
}

const useOptionStore = create<Store>((set, get) => ({
  rank: 1,
  setRank: (item: number) => set(() => ({ rank: item })),
  getRank: () => get().rank,
}));

export { useOptionStore };
