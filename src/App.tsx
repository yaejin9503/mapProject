/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react"
import KakaoMap from "./components/common/KakaoMap"
import { HouseInfo } from "./commons/types/types";
import { addGeocoder, fetchData, removeDupplicateAddress } from "./api/houseApi";

function App() {
  const [longitude, setLongitude] = useState<number>(126.93990862062978);
  const [latitude, setLatitude] = useState<number>(37.56496830314491);
  const [addGeocoderData, setAddGeoCoderData] = useState<Array<HouseInfo> | undefined>([]); //주소 중복 제거 후 경도 위도 추가 
  

  useEffect(() => {
    getData(); 
  }, []); 

  const getData = async () => { 
    const data = await addGeocoder(); 
    setAddGeoCoderData(data);  
  }

  return (
    <>
      <KakaoMap latitude={latitude} longitude={longitude} data={addGeocoderData} />
    </>
  )
}

export default App
