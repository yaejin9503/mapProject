import { useEffect, useState } from "react"
import KakaoMap from "./components/common/KakaoMap"
import _ from "lodash";
import { HouseInfo, AddressFucResult } from "./commons/types/types";
import { flushSync } from "react-dom";

const { kakao } = window;


function App() {
  const [longitude, setLongitude] = useState<number>(126.93990862062978);
  const [latitude, setLatitude] = useState<number>(37.56496830314491);
  const [data, setData] = useState<Array<HouseInfo>>([]);
  const [noDupplicateAddress, setNoDupplicatteAddress] = useState<Array<HouseInfo>>([]);
  const [test, setTest] = useState<Array<HouseInfo>>([]);


  useEffect(() => {
    fetchData(); 

    let houseInfo: Array<HouseInfo> = []; 
    const geocoder = new kakao.maps.services.Geocoder();    // 장소 검색 서비스 객체를 생성한다.
    for (let house of noDupplicateAddress) {
      geocoder.addressSearch(house.address, function (result: Array<AddressFucResult>, status: kakao.maps.services.Status) {
        if (status === kakao.maps.services.Status.OK) {
          // console.log(result[0].address_name, result[0].address_type, result[0].address); 
          // console.log(noDupplicateAddress);
          let compareAddress = result[0].address_name.split(' ').join('').trim(); 
          let index = noDupplicateAddress.findIndex(({ notSpaceAddress }) => notSpaceAddress === compareAddress);
         
          if(index !== -1){ 
            noDupplicateAddress[index].longitude = result[0] && Number(result[0]?.x); 
            noDupplicateAddress[index].latitude = result[0] && Number(result[0]?.y); 
            houseInfo.push(noDupplicateAddress[index]); 
          }
        }
      })
    };
    setTest(houseInfo); 
  }, [])

  const fetchData = () => { 
    fetch("./src/api/house.json")
      .then((response) => response.json())
      .then(async (json) => {
        const { items } = await json;
        flushSync(() => {
          //setData(items);
          // setNoDupplicatteAddress(_.uniqBy(items, "address"));
          const houseArray: Array<HouseInfo> = items.map(( house: HouseInfo ) =>  {
            house.notSpaceAddress = house.address.slice(0, house.address.indexOf("(")).replace('서울특별시', '서울').split(' ').join('').trim(); 
            return house
          }); 
          let notDupplicate: Array<HouseInfo>  = [] ; 
          items.forEach(( house: HouseInfo ) => { 
            let isHouse = notDupplicate.findIndex(item => item.notSpaceAddress === house.notSpaceAddress);
            if(isHouse === -1){ 
              notDupplicate.push(house); 
            }
          }); 

          setData(houseArray);
          setNoDupplicatteAddress(notDupplicate);
        })
      });
  }

  return (
    <>
      <KakaoMap latitude={latitude} longitude={longitude} data={test} />
    </>
  )
}

export default App
