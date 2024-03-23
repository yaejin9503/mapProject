import { create } from "zustand";

interface Store {
  selectedMarkerId: number;
  longitude: number;
  latitude: number;
  myLongitude: number | null;
  myLatitude: number | null;
  setSelectedMarkerId: (item: number) => void;
  setLongLat: (item: LogLat) => void;
  setMyLongLat: (item: LogLat) => void;
}

type LogLat = {
  longitude: number;
  latitude: number;
};

const useUserStore = create<Store>((set) => ({
  selectedMarkerId: 0,
  longitude: 126.93990862062978,
  latitude: 37.56496830314491,
  myLongitude: null,
  myLatitude: null,
  setSelectedMarkerId: (item: number) =>
    set(() => ({ selectedMarkerId: item })),
  setLongLat: (item: LogLat) =>
    set(() => ({ longitude: item.longitude, latitude: item.latitude })),
  setMyLongLat: (item: LogLat) =>
    set(() => ({ myLongitude: item.longitude, myLatitude: item.latitude })),
}));

export { useUserStore };
