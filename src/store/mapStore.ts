import { create } from "zustand";

interface Store {
  selectedMarkerId: number;
  longitude: number;
  latitude: number;
  setSelectedMarkerId: (item: number) => void;
  setLongLat: (item: LogLat) => void;
}

type LogLat = {
  longitude: number;
  latitude: number;
};

const useUserStore = create<Store>((set) => ({
  selectedMarkerId: 0,
  longitude: 126.93990862062978,
  latitude: 37.56496830314491,
  setSelectedMarkerId: (item: number) =>
    set(() => ({ selectedMarkerId: item })),
  setLongLat: (item: LogLat) =>
    set(() => ({ longitude: item.longitude, latitude: item.latitude })),
}));

export { useUserStore };
