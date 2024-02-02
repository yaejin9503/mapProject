/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import KakaoMap from "./components/common/KakaoMap";
import { HouseInfo } from "./commons/types/types";
import { houseWithGeocoder } from "./api/houseApi";
import { getMyGeoLocation } from "./api/userApi";
import OptionSearch from "./components/options/OptionSearch";

function App() {
  const [longitude, setLongitude] = useState<number>(126.93990862062978);
  const [latitude, setLatitude] = useState<number>(37.56496830314491);
  const [addGeocoderData, setAddGeoCoderData] = useState<
    Array<HouseInfo> | undefined
  >([]);

  useEffect(() => {
    // 내 현재 위치를 가져오는 함수
    const getMyGeoCoder = async () => {
      const data = await getMyGeoLocation();
      if (data && data.length > 0) {
        setLatitude(data[0]);
        setLongitude(data[1]);
      }
    };

    // 주소에 따른 경도 위도 추가하는 함수
    const getGeoCoderData = async () => {
      const data = await houseWithGeocoder();
      setAddGeoCoderData(data);
    };

    getMyGeoCoder();
    getGeoCoderData();
  }, []);

  return (
    <>
      <OptionSearch></OptionSearch>
      <div>
        <KakaoMap
          latitude={latitude}
          longitude={longitude}
          data={addGeocoderData}
        />
      </div>
    </>
  );
}

export default App;
