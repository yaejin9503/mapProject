import { useEffect, useRef, useState } from "react";
import { IPropsMap } from "../../commons/types/types";
import KakaoMapMarker from "../units/KakaoMapMarker";
import { useUserStore } from "../../store/mapStore";
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import { FiMinus } from "@react-icons/all-files/fi/FiMinus";
import { BiCurrentLocation } from "@react-icons/all-files/bi/BiCurrentLocation";

export default function KakaoMap(props: IPropsMap) {
  const mapDiv = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<kakao.maps.Map>();
  const [currentMarker, setCurrentMarker] = useState<kakao.maps.Marker>();
  // 왜 필요해? kakao map이 생성되는 타이밍을 알아야된다, 마커에도 중앙값에도,
  //  effect의 동작은 렌더링이 일어났을 떄, 디펜던시로 일어난 값이 바뀌는 지 알아야 되는 거 니까.
  const { longitude, latitude, myLongitude, myLatitude } = useUserStore();

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

  const clickPlusMinus = (type: string) => {
    if (map) {
      const level = map.getLevel();
      map.setLevel(type === "+" ? level - 1 : level + 1);
    }
  };

  const clickCurrentIcon = async () => {
    if (!currentMarker) {
      const img =
        "https://assets-global.website-files.com/62c5e0898dea0b799c5f2210/62e8212acc540f291431bad2_location-icon.png";
      const imgSize = new kakao.maps.Size(24, 24);

      const markerImage = new kakao.maps.MarkerImage(img, imgSize);
      const markerPosition = new kakao.maps.LatLng(myLatitude, myLongitude); // 마커가 표시될 위치입니다

      const marker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });

      if (map) {
        setCurrentMarker(marker);
        marker.setMap(map);
      }
    }
    const moveLatLon = new kakao.maps.LatLng(myLatitude, myLongitude);
    map?.panTo(moveLatLon);
  };

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
      <div className="absolute z-10 flex flex-col text-black right-3 bottom-[40%] rounded-[3px] ">
        <button
          disabled={!myLatitude && !myLongitude}
          onClick={clickCurrentIcon}
          className="block p-3 mb-3 bg-white rounded border-solid border border-[#9ca3af] active:bg-[#eef0f3] disabled:bg-[#e9eaeb]"
        >
          <BiCurrentLocation />
        </button>
        <div className="border-solid border border-[#9ca3af] rounded">
          <button
            onClick={() => clickPlusMinus("+")}
            className="block p-3 bg-white rounded-t active:bg-[#eef0f3]"
          >
            <FiPlus />
          </button>
          <button
            onClick={() => clickPlusMinus("-")}
            className="block p-3 bg-white rounded-b active:bg-[#eef0f3]"
          >
            <FiMinus />
          </button>
        </div>
      </div>
    </>
  );
}
