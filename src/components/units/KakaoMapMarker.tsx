import { useEffect, useState } from "react";
import { HouseInfo, MarkerInfo } from "../../commons/types/types";

interface IMarkerprops { 
  map: kakao.maps.Map
  data : Array<HouseInfo> | undefined
}

export default function KakaoMapMarker(props : IMarkerprops){  
  const [ marker, setMarker ] = useState<Array<HouseInfo> | undefined>([]); 

  useEffect(() => { 
    return setMarker(props.data);
  }, [props.data])


  useEffect(() => { 
    const positions: Array<MarkerInfo> = [];

    props?.data?.forEach((house: HouseInfo) => {
      const obj: MarkerInfo = {
        content: `<div style="color:#000;text-align:center">${house.houseName}</div>`,
        latlng: new kakao.maps.LatLng(house.latitude, house.longitude)
      };
      positions.push(obj);
    })


    for (let i = 0; i < positions.length; i++) {
      // 마커를 생성합니다
      const marker = new kakao.maps.Marker({
        map: props.map, // 마커를 표시할 지도
        position: positions[i].latlng // 마커의 위치
      });

      // 마커에 표시할 인포윈도우를 생성합니다 
      const infowindow = new kakao.maps.InfoWindow({
        content: positions[i].content // 인포윈도우에 표시할 내용
      });

      // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
      // 이벤트 리스너로는 클로저를 만들어 등록합니다 
      // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
      kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(props.map, marker, infowindow));
      kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
    }

    // 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
    function makeOverListener(map: kakao.maps.Map, marker: kakao.maps.Marker, infowindow: kakao.maps.InfoWindow) {
      return function () {
        infowindow.open(map, marker);
      };
    }

    // 인포윈도우를 닫는 클로저를 만드는 함수입니다 
    function makeOutListener(infowindow: kakao.maps.InfoWindow) {
      return function () {
        infowindow.close();
      };
    }


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marker])

  return( 
    <></>
  ); 
}