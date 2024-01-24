/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react"
import KakaoMap from "./components/common/KakaoMap"
import { HouseInfo, AddressFucResult } from "./commons/types/types";

function App() {
  const [longitude, setLongitude] = useState<number>(126.93990862062978);
  const [latitude, setLatitude] = useState<number>(37.56496830314491);
  const [addGeocoderData, setAddGeoCoderData] = useState<Array<HouseInfo>>([]); //주소 중복 제거 후 경도 위도 추가 

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
          houseArray.forEach((house: HouseInfo) => {
            const isHouse = notDupplicate.findIndex(item => item.notSpaceAddress === house.notSpaceAddress);
            if (isHouse === -1) {
              notDupplicate.push(house);
            }
          });
          
          return notDupplicate; 
      })
      .then((notDupplicate)  => { 
        addGeocoder(notDupplicate); 
      })
  }


  const  addGeocoder = (notDupplicate : Array<HouseInfo>) => { 
      const geocoder = new kakao.maps.services.Geocoder();    // 장소 검색 서비스 객체를 생성한다.

      const addressSearchPromise = (house : HouseInfo) : Promise<AddressFucResult> => {
        return new Promise((resolve) => {   
          geocoder.addressSearch(house.address, (result : Array<AddressFucResult> ,status :  kakao.maps.services.Status) => { 
            if(status == 'OK' && status === kakao.maps.services.Status.OK){ 
              resolve(result[0]);
            }
          })               
        })
      }
    
       Promise.all(notDupplicate.map(house => addressSearchPromise(house))).then((returnData) => {
        const geocoderData : Array<HouseInfo> = [];  
        returnData.forEach((result) => { 
          if(!result) return; 

          const compareAddress = result.address_name.split(' ').join('').trim();
          const index = notDupplicate.findIndex(({ notSpaceAddress }) => notSpaceAddress === compareAddress);
          const obj: HouseInfo = { ...notDupplicate[index] }; 
          if (index !== -1) {
            obj.longitude =  Number(result.x);
            obj.latitude = Number(result.y);
          }
          geocoderData.push(obj); 
        }) 
        setAddGeoCoderData(geocoderData); 
      })
    }
    

  return (
    <>
      <KakaoMap latitude={latitude} longitude={longitude} data={addGeocoderData} />
    </>
  )
}

export default App
