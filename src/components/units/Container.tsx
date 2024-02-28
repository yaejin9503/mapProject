import { lazy } from "react";
import { IPropsMap } from "../../commons/types/types";
import { useUserStore } from "../../store/mapStore";
import KakaoMap from "../common/KakaoMap";
import OptionSearch from "../options/OptionSearch";
const SideInfo = lazy(() => import("../side/SideInfo"));

export default function Container(props: IPropsMap) {
  const { selectedMarkerId } = useUserStore();

  return (
    <>
      <OptionSearch></OptionSearch>
      <div className="flex">
        <SideInfo data={props.data} key={selectedMarkerId} />
        <KakaoMap data={props.data} />
      </div>
    </>
  );
}
