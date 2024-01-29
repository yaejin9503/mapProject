import { useEffect, useState } from "react";
import { HouseInfo, MarkerInfo } from "../../commons/types/types";
import { useOptionStore } from "../../store/optionStore";

interface IMarkerprops { 
  map: kakao.maps.Map
  data : Array<HouseInfo> | undefined
}

export default function KakaoMapMarker(props : IMarkerprops){  
  const [ marker, setMarker ] = useState<Array<HouseInfo> | undefined>([]); 
  const { rank } = useOptionStore(); 

  useEffect(() => { 
    return setMarker(props.data);
  }, [props.data])


  useEffect(() => { 
    const positions: Array<MarkerInfo> = [];

    props?.data?.forEach((house: HouseInfo) => {
      const obj: MarkerInfo = {
        content: `<div style="color:#000;text-align:center;background-color: #f8f5f5;padding: 3px 7px;font-size: 12px;border-radius: 12px;box-shadow: 0 0 0 1px #000 inset;">
                      <div>sh주택공사</div> 
                      <div style="font-size:11px">${(rank === 1? house.firstNumYouthRent : house.secondNumYouthRent).toLocaleString('ko-KR', {style: 'currency', currency: 'KRW'})}</div>
                  </div>`,
        latlng: new kakao.maps.LatLng(house.latitude, house.longitude)
      };
      positions.push(obj);
    })


    for (let i = 0; i < positions.length; i++) {
      // 마커를 생성합니다

      const customOverlay = new kakao.maps.CustomOverlay({
        position: positions[i].latlng,
        content: positions[i].content   
      }); 

      customOverlay.setMap(props.map);
    }


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marker, rank])

  return( 
    <></>
  ); 
}