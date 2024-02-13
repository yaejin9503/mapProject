import { useEffect, useRef, useState } from "react";
import { IPropsMap } from "../../commons/types/types";
import KakaoMapMarker from "../units/KakaoMapMarker";
import { useUserStore } from "../../store/mapStore";

export default function KakaoMap(props: IPropsMap) {
  const mapDiv = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<kakao.maps.Map>();
  // 왜 필요해? kakao map이 생성되는 타이밍을 알아야된다, 마커에도 중앙값에도,
  //  effect의 동작은 렌더링이 일어났을 떄, 디펜던시로 일어난 값이 바뀌는 지 알아야 되는 거 니까.
  const { longitude, latitude } = useUserStore();

  useEffect(() => {
    const container = mapDiv.current as HTMLDivElement;
    const option = {
      center: new kakao.maps.LatLng(latitude, longitude), //지도의 중심좌표.
      level: 7, //지도의 레벨(확대, 축소 정도)
    };

    setMap(
      new kakao.maps.Map(
        container as HTMLDivElement,
        option as kakao.maps.MapOptions
      )
    ); //지도 생성 및 객체 리턴
  }, []);

  // 위도 경도 중심으로 지도 중앙값을 변경해줌.
  useEffect(() => {
    const moveLatLon = new kakao.maps.LatLng(latitude, longitude);

    // 지도 중심을 이동 시킵니다
    map?.panTo(moveLatLon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [longitude, latitude]);

  return (
    <>
      {map ? <KakaoMapMarker map={map} data={props.data} /> : <> </>}
      <div
        ref={mapDiv}
        style={{
          width: "100vw",
          height: "100vh",
        }}
      ></div>
    </>
  );
}
