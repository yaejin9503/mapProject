/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { HouseInfo } from "./commons/types/types";
import { houseWithGeocoder } from "./api/houseApi";
import { getMyGeoLocation } from "./api/userApi";
import { useUserStore } from "./store/mapStore";
import Container from "./components/units/Container";
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
  const [addGeocoderData, setAddGeoCoderData] = useState<Array<HouseInfo>>([]);
  const { setLongLat } = useUserStore();

  useEffect(() => {
    // 내 현재 위치를 가져오는 함수
    const getMyGeoCoder = async () => {
      const data = await getMyGeoLocation();
      if (data && data.length > 0) {
        setLongLat({ longitude: data[1], latitude: data[0] });
      }
    };

    // 주소에 따른 경도 위도 추가하는 함수
    const getGeoCoderData = async () => {
      const data = await houseWithGeocoder();
      if (data) setAddGeoCoderData(data);
    };

    getMyGeoCoder();
    getGeoCoderData();
  }, []);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Container data={addGeocoderData} />
    </QueryClientProvider>
  );
}

export default App;
