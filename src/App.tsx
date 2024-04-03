/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { HouseInfo } from "./commons/types/types";
import { getNotification, houseWithGeocoder } from "./api/houseApi";
import { getMyGeoLocation } from "./api/userApi";
import { useUserStore } from "./store/mapStore";
import Container from "./components/units/Container";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHouseStore } from "./store/houseStore";

function App() {
  const [addGeocoderData, setAddGeoCoderData] = useState<Array<HouseInfo>>([]);
  const { setLongLat, setMyLongLat } = useUserStore();
  const { setNotificationArrs } = useHouseStore();

  useEffect(() => {
    // 내 현재 위치를 가져오는 함수
    const getMyGeoCoder = async () => {
      const data = await getMyGeoLocation();
      if (data && data.length > 0) {
        setLongLat({ longitude: data[1], latitude: data[0] });
        setMyLongLat({ longitude: data[1], latitude: data[0] });
      }
    };

    // 주소에 따른 경도 위도 추가하는 함수
    const getGeoCoderData = async () => {
      const data = await houseWithGeocoder();
      if (data) setAddGeoCoderData(data);
    };

    //전체 공고 가져오는 로직
    const getNotificationFn = async () => {
      const data = await getNotification();
      if (data) setNotificationArrs(data);
    };

    getMyGeoCoder();
    getGeoCoderData();
    getNotificationFn();
  }, []);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Container data={addGeocoderData} />
    </QueryClientProvider>
  );
}

export default App;
