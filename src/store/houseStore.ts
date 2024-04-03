import { create } from "zustand";
import { Notification } from "../commons/types/types";

interface House {
  notificationArrs: Notification[];
  setNotificationArrs: (item: Notification[]) => void;
  getAllNotification: () => void;
  getOneNotification: (typeId: string) => void;
}

const useHouseStore = create<House>((set, get) => ({
  notificationArrs: [],
  setNotificationArrs: (item: Notification[]) =>
    set(() => ({ notificationArrs: item })),
  getAllNotification: () => get().notificationArrs,
  getOneNotification: (typeId: string) => {
    return get().notificationArrs.find((item) => item.id === typeId);
  },
}));

export { useHouseStore };
