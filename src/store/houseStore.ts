import { create } from "zustand";
import { HouseInfo, Notification } from "../commons/types/types";

interface House {
  notificationArrs: Notification[];
  houseData: HouseInfo[];
  setNotificationArrs: (item: Notification[]) => void;
  getAllNotification: () => void;
  getOneNotification: (typeId: string) => void;
  setHouseData: (item: HouseInfo[]) => void;
}

const useHouseStore = create<House>((set, get) => ({
  notificationArrs: [],
  houseData: [],
  setNotificationArrs: (item: Notification[]) =>
    set(() => ({ notificationArrs: item })),
  getAllNotification: () => get().notificationArrs,
  getOneNotification: (typeId: string) => {
    return get().notificationArrs.find((item) => item.id === typeId);
  },
  setHouseData: (item: HouseInfo[]) => set(() => ({ houseData: item })),
}));

export { useHouseStore };
