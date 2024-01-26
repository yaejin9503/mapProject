import { useEffect, useRef, useState } from "react";
import { IPropsMap } from "../../commons/types/types";
import KakaoMapMarker from "../units/KakaoMapMarker";

export default function KakaoMap(props: IPropsMap) {
  const mapDiv = useRef<HTMLDivElement>(null);
  const [ map, setMap ] = useState<kakao.maps.Map>();
  const [ containerState, setContainerState ] = useState<HTMLDivElement | null>(null); 
  const [ optionsState , setOptionsState ] = useState<kakao.maps.MapOptions | null>(null);  

  useEffect(() => {
    setContainerState(mapDiv.current as HTMLDivElement); 
    setOptionsState({ //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(props.latitude, props.longitude), //지도의 중심좌표.
      level: 7 //지도의 레벨(확대, 축소 정도) 
    }); 

  }, [props.latitude, props.longitude])

  useEffect(() => { 
    if(containerState != null && optionsState != null){ 
      // 맵을 실제적으로 생성함 
     setMap(new kakao.maps.Map(containerState as HTMLDivElement, optionsState as kakao.maps.MapOptions)); //지도 생성 및 객체 리턴
    }
  }, [containerState, optionsState])


  return (
    <>
      { 
        map ? 
        <KakaoMapMarker map={map} data={props.data}/> : <> </>
      }
      <div ref={mapDiv}
        style={{
          width: '100vw',
          height: '100vh'
        }}>
      </div>
    </>
  )
}