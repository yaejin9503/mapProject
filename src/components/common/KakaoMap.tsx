import { useEffect } from "react";

const { kakao } = window; 
export default function KakaoMap(props : any){

  useEffect(() => { 
    const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    const options = { //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng( props.latitude, props.longitude), //지도의 중심좌표.
      level: 3 //지도의 레벨(확대, 축소 정도) 
    };

    const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

  }, [])
  
  return( 
    <div id="map" 
        style={{
          width : '100vw', 
          height: '100vh'
         }}>
    </div>
  )
}