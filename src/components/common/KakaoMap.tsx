import { useEffect, useRef } from "react";
import { IPropsMap, HouseInfo, MarkerInfo } from "../../commons/types/types";


const { kakao } = window;

export default function KakaoMap(props: IPropsMap) {
  const mapDiv = useRef(null);


  useEffect(() => {
    const container = mapDiv.current; //지도를 담을 영역의 DOM 레퍼런스
    const options = { //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(props.latitude, props.longitude), //지도의 중심좌표.
      level: 7 //지도의 레벨(확대, 축소 정도) 
    };

    const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

    let positions: Array<MarkerInfo> = [];

    props.data.forEach((house: HouseInfo) => {
      let obj: MarkerInfo = {
        content: `<div style="color:#000;text-align:center">${house.houseName}</div>`,
        latlng: new kakao.maps.LatLng(house?.latitude, house?.longitude)
      };
      positions.push(obj);
    })
    console.log(positions);

    for (var i = 0; i < positions.length; i++) {
      // 마커를 생성합니다
      var marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: positions[i].latlng // 마커의 위치
      });

      // 마커에 표시할 인포윈도우를 생성합니다 
      var infowindow = new kakao.maps.InfoWindow({
        content: positions[i].content // 인포윈도우에 표시할 내용
      });

      // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
      // 이벤트 리스너로는 클로저를 만들어 등록합니다 
      // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
      kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
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
  }, [props.data])



  return (
    <div ref={mapDiv}
      style={{
        width: '100vw',
        height: '100vh'
      }}>
    </div>
  )
}