/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react"
import KakaoMap from "./components/common/KakaoMap"
import { HouseInfo, AddressFucResult } from "./commons/types/types";

function App() {
  const [longitude, setLongitude] = useState<number>(126.93990862062978);
  const [latitude, setLatitude] = useState<number>(37.56496830314491);
  const [data, setData] = useState<Array<HouseInfo>>([]);
  const [noDupplicateAddress, setNoDupplicatteAddress] = useState<Array<HouseInfo>>([]);

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = () => {
    fetch("./src/api/house.json")
      .then((response) => response.json())
      .then((json) => {
        const { items } = json;
          
          const houseArray: Array<HouseInfo> = items.map((house: HouseInfo) => {
            house.notSpaceAddress = house.address.slice(0, house.address.indexOf("(")).replace('서울특별시', '서울').split(' ').join('').trim();
            return house
          });
          const notDupplicate: Array<HouseInfo> = [];
          items.forEach((house: HouseInfo) => {
            const isHouse = notDupplicate.findIndex(item => item.notSpaceAddress === house.notSpaceAddress);
            if (isHouse === -1) {
              notDupplicate.push(house);
            }
          });

          setData(houseArray); 
          return notDupplicate; 
      })
      .then((data)  => { 
        return addGeocoder(data); 
      })
      .then((data) => { 
        setNoDupplicatteAddress(data);
      })
  }

  const addGeocoder = (data : Array<HouseInfo>) => { 
    const geocoder = new kakao.maps.services.Geocoder();    // 장소 검색 서비스 객체를 생성한다.
   
    for (const house of data) {
      geocoder.addressSearch(house.address, function (result: Array<AddressFucResult>, status: kakao.maps.services.Status) {
        if (status === kakao.maps.services.Status.OK) {
          const compareAddress = result[0].address_name.split(' ').join('').trim();
          const index = data.findIndex(({ notSpaceAddress }) => notSpaceAddress === compareAddress);

          if (index !== -1) {
            data[index].longitude = result[0] && Number(result[0]?.x);
            data[index].latitude = result[0] && Number(result[0]?.y);
          }
        }
      })
    }
    return data; 
  }

  return (
    <>
      <KakaoMap latitude={latitude} longitude={longitude} data={noDupplicateAddress} />
    </>
  )
}

export default App
