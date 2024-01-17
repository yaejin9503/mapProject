import { useEffect, useRef, useState } from "react";
import { IPropsMap } from "../../commons/types/types";
import KakaoMapMarker from "../units/KakaoMapMarker";

const { kakao } = window; 

export default function KakaoMap(props: IPropsMap) {
  const mapDiv = useRef(null);
  const [ map, setMap ] = useState();

  useEffect(() => {
    const container = mapDiv.current; //지도를 담을 영역의 DOM 레퍼런스
    const options = { //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(props.latitude, props.longitude), //지도의 중심좌표.
      level: 7 //지도의 레벨(확대, 축소 정도) 
    };
    setMap(new kakao.maps.Map(container, options)); //지도 생성 및 객체 리턴

  }, [props.latitude, props.longitude])



  return (
    <>
      <KakaoMapMarker map={map} data={props.data}/>
      <div ref={mapDiv}
        style={{
          width: '100vw',
          height: '100vh'
        }}>
      </div>
    </>
    
  )
}