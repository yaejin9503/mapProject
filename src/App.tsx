/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from "react";
import { getNotification, houseWithGeocoder } from "./api/houseApi";
import { getMyGeoLocation } from "./api/userApi";
import { useUserStore } from "./store/mapStore";
import Container from "./components/units/Container";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHouseStore } from "./store/houseStore";
import { useLocation } from "react-router-dom";

function App() {
  // const [addGeocoderData, setAddGeoCoderData] = useState<Array<HouseInfo>>([]);
  const { setLongLat, setMyLongLat } = useUserStore();
  const { setNotificationArrs, setHouseData } = useHouseStore();
  const { setSelectedMarkerId } = useUserStore();
  const location = useLocation();
  const selectedMarker = location.pathname
    ? location.pathname.split("/house/")[1]
    : 0;

  useEffect(() => {
    // 내 현재 위치를 가져오는 함수
    const getMyGeoCoder = async () => {
      const data = await getMyGeoLocation();
      if (data && data.length > 0) {
        if (!selectedMarker) {
          setLongLat({ longitude: data[1], latitude: data[0] });
        }
        setMyLongLat({ longitude: data[1], latitude: data[0] });
      }
    };

    // 주소에 따른 경도 위도 추가하는 함수
    const getGeoCoderData = async () => {
      const data = await houseWithGeocoder();
      if (data) {
        setHouseData(data);
        const selectedHouse = data.find(
          (house) => house.id === Number(selectedMarker)
        );

        if (selectedHouse) {
          setLongLat({
            longitude: selectedHouse.longitude,
            latitude: selectedHouse.latitude,
          });
        }
      }
    };

    //전체 공고 가져오는 로직
    const getNotificationFn = async () => {
      const data = await getNotification();
      if (data) setNotificationArrs(data);
    };

    //공유하기로 페이지 진입한 경우
    const isUrl = () => {
      if (location.pathname) {
        setSelectedMarkerId(Number(selectedMarker));
      }
    };

    isUrl();
    getMyGeoCoder();
    getGeoCoderData();
    getNotificationFn();
  }, []);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Container />
    </QueryClientProvider>
  );
} //data={addGeocoderData}

export default App;
