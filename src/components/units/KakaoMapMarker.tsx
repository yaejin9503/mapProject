import { useEffect, useRef } from "react";

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
  const overay = useRef<kakao.maps.CustomOverlay[]>();
  const markerHouse = props.data?.map((house) => {
    house.selected = false;
    return house;
  });

  const createOveray = (markerHouses: HouseInfo[]) => {
    const customOverlay: kakao.maps.CustomOverlay[] = [];
    markerHouses.forEach((house: HouseInfo) => {
      const contents = renderingMarker(house);
      const obj: MarkerInfo = createMapObj(contents, house);
      const overay = createCustomOverlay(obj);
      customOverlay.push(overay);

      overay.setMap(props.map);
      createMapMarkerEvent(contents);
    });
    overay.current = customOverlay;
  };

  const removeOveray = () => {
    overay.current?.forEach((item) => {
      item.setMap(null);
    });
    overay.current = [];
  };

  useEffect(() => {
    removeOveray();
    createOveray(markerHouse);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data, rank]);

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
    addEventHandle(contents, "click", function () {
      setSelectedMarkerId(Number(contents.id));

      const selectedHouse = markerHouse.find(
        (item) => item.id === Number(contents.id)
      );

      if (selectedHouse) {
        const markerHoues = markerHouse.map((item) => {
          item.selected = Number(contents.id) === item.id ? true : false;
          return item;
        });

        removeOveray();
        createOveray(markerHoues);

        setLongLat({
          longitude: selectedHouse.longitude,
          latitude: selectedHouse.latitude,
        });
      }
    });
  };

  return (
    <>
      {/* <ModalInfo isOpen={isOpen} setIsOpen={() => setIsOpen(!isOpen)} /> */}
    </>
  );
}
