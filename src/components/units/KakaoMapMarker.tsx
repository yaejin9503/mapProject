import { useEffect, useState } from "react";

import { HouseInfo, MarkerInfo } from "../../commons/types/types";
import { useOptionStore } from "../../store/optionStore";
import { useUserStore } from "../../store/mapStore";
// import ModalInfo from "../common/modal/ModalInfo";

interface IMarkerprops {
  map: kakao.maps.Map;
  data: Array<HouseInfo>;
}

export default function KakaoMapMarker(props: IMarkerprops) {
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  const { setSelectedMarkerId, setLongLat } = useUserStore();

  const { rank } = useOptionStore();
  const [markerHouse, setMarkerHouse] = useState<HouseInfo[]>([]);
  const [overay, setOveray] = useState<kakao.maps.CustomOverlay[]>();

  useEffect(() => {
    const markerHouse = props.data?.map((house) => {
      house.selected = false;
      return house;
    });
    setMarkerHouse(markerHouse);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  const createOveray = () => {
    const customOverlay: kakao.maps.CustomOverlay[] = [];
    markerHouse.forEach((house: HouseInfo) => {
      const contents = renderingMarker(house);
      const obj: MarkerInfo = createMapObj(contents, house);
      const overay = createCustomOverlay(obj);
      customOverlay.push(overay);

      overay.setMap(props.map);
      createMapMarkerEvent(contents);
    });
    setOveray(customOverlay);
  };

  const removeOveray = () => {
    overay?.forEach((item) => {
      item.setMap(null);
    });
    setOveray([]);
  };

  useEffect(() => {
    removeOveray();
    createOveray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerHouse, rank]);

  const addEventHandle = (
    target: HTMLElement,
    type: string,
    callback: () => void
  ) => {
    if (target.addEventListener) {
      target.addEventListener(type, callback);
    }
  };

  // 마커를 그리는 함수
  const renderingMarker = (house: HouseInfo) => {
    const contents = document.createElement("button");
    contents.style.backgroundColor = !house.selected ? "#f8f5f5" : "#000";
    contents.style.color = !house.selected ? "#000" : "#f8f5f5";
    contents.style.borderRadius = "12px";
    contents.style.boxShadow = "0 0 0 1px #000 inset";
    contents.id = house.id.toString();
    contents.innerHTML = `
      <div style="text-align:center;
                  padding: 3px 7px;
                  font-size: 12px;
                  ">
          <div>sh주택공사</div> 
          <div style="font-size:11px">
            ${(rank === 1
              ? house.firstNumYouthRent
              : house.secondNumYouthRent
            ).toLocaleString("ko-KR", { style: "currency", currency: "KRW" })}
          </div>
      </div>
      `;
    return contents;
  };

  const createMapObj = (contents: HTMLElement, house: HouseInfo) => {
    return {
      content: contents,
      latlng: new kakao.maps.LatLng(house.latitude, house.longitude),
    };
  };

  const createCustomOverlay = (obj: MarkerInfo): kakao.maps.CustomOverlay => {
    return new kakao.maps.CustomOverlay({
      position: obj.latlng,
      content: obj.content,
    });
  };

  const createMapMarkerEvent = (contents: HTMLElement) => {
    // customOverlay.setMap(props.map);

    addEventHandle(contents, "click", function () {
      setSelectedMarkerId(Number(contents.id));

      const selectedHouse = markerHouse.find(
        (item) => item.id === Number(contents.id)
      );

      if (selectedHouse) {
        const markers = markerHouse.map((item) => {
          item.selected = Number(contents.id) === item.id ? true : false;
          return item;
        });

        setMarkerHouse(markers);

        setLongLat({
          longitude: selectedHouse.longitude,
          latitude: selectedHouse.latitude,
        });
      }
    });
  };

  // useEffect(() => {
  //   // 선택되엇던 데이터 원래대로 렌더링
  //   if (selectedMarkerId !== 0) {
  //     const beforeSelected = marker.filter((item) => item.selected);
  //     if (
  //       beforeSelected &&
  //       Array.isArray(beforeSelected) &&
  //       beforeSelected.length > 0
  //     ) {
  //       beforeSelected[0].selected = false;
  //       const house = beforeSelected[0];

  //       const contents = renderingMarker(house);
  //       const obj: MarkerInfo = createMapObj(contents, house);
  //       const customOverlay = createCustomOverlay(obj);

  //       createMapMarker(customOverlay, contents);
  //     }

  //     // 선택한 데이터 선택한 렌더링
  //     const selectedHouse = marker
  //       .map((item) => {
  //         if (item.id === selectedMarkerId) {
  //           item.selected = true;
  //         }
  //         return item;
  //       })
  //       .filter((item) => item.selected)[0];

  //     const contents = renderingMarker(selectedHouse);
  //     const obj: MarkerInfo = createMapObj(contents, selectedHouse);
  //     const customOverlay = createCustomOverlay(obj);

  //     createMapMarker(customOverlay, contents);

  //     //마커 기준으로 중앙값 옮기기,
  //     setLongitude(selectedHouse.longitude);
  //     setLatitude(selectedHouse.latitude);
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedMarkerId]);

  return (
    <>
      {/* <ModalInfo isOpen={isOpen} setIsOpen={() => setIsOpen(!isOpen)} /> */}
    </>
  );
}
