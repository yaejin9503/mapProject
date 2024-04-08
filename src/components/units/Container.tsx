import { Suspense, lazy } from "react";
// import { IPropsMap } from "../../commons/types/types";
import { useUserStore } from "../../store/mapStore";
import KakaoMap from "../common/KakaoMap";
import OptionSearch from "../options/OptionSearch";
import { Outlet } from "react-router-dom";
//import SideInfo from "../side/SideInfo";
const SideInfo = lazy(() => import("../side/SideInfo"));

export default function Container() {
  const { selectedMarkerId } = useUserStore();

  return (
    <>
      <OptionSearch></OptionSearch>
      <div className="flex">
        {selectedMarkerId !== 0 && (
          <Suspense fallback={<div>loading..</div>}>
            <SideInfo key={selectedMarkerId} />
            {/* <Outlet /> */}
          </Suspense>
        )}
        <KakaoMap />
      </div>
    </>
  );
}
