import { useEffect, useState } from "react";

import { HouseInfo, MarkerInfo } from "../../commons/types/types";
import { useOptionStore } from "../../store/optionStore";
import ModalInfo from "../common/modal/ModalInfo";

interface IMarkerprops {
  map: kakao.maps.Map;
  data: Array<HouseInfo> | undefined;
}

export default function KakaoMapMarker(props: IMarkerprops) {
  const [marker, setMarker] = useState<Array<HouseInfo> | undefined>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { rank } = useOptionStore();

  useEffect(() => {
    return setMarker(props.data);
  }, [props.data]);

  const addEventHandle = (
    target: HTMLElement,
    type: string,
    callback: () => void
  ) => {
    if (target.addEventListener) {
      target.addEventListener(type, callback);
    }
  };

  useEffect(() => {
    props?.data?.forEach((house: HouseInfo) => {
      const contents = document.createElement("button");
      contents.style.backgroundColor = "#f8f5f5";
      contents.style.color = "#000";
      contents.style.borderRadius = "12px";
      contents.style.boxShadow = "0 0 0 1px #000 inset";
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
      const obj: MarkerInfo = {
        content: contents,
        latlng: new kakao.maps.LatLng(house.latitude, house.longitude),
      };

      const customOverlay = new kakao.maps.CustomOverlay({
        position: obj.latlng,
        content: obj.content,
      });

      customOverlay.setMap(props.map);

      addEventHandle(contents, "click", function () {
        // contents.
        contents.style.backgroundColor = "#000";
        contents.style.color = "#f8f5f5";
        setIsOpen(true);
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marker, rank]);

  return (
    <>
      <ModalInfo isOpen={isOpen} setIsOpen={() => setIsOpen(!isOpen)} />
    </>
  );
}
