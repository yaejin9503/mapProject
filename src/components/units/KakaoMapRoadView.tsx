import { useEffect, useRef } from "react";
import { useUserStore } from "../../store/mapStore";

// interface Iprops {
//   selectedLng: number;
//   selectedLat: number;
// }
// props: Iprops
export default function KakaoMapRoadView() {
  const roadviewDiv = useRef<HTMLDivElement>(null);
  const { latitude, longitude } = useUserStore();

  useEffect(() => {
    const roadviewContainer = roadviewDiv.current as HTMLDivElement; //로드뷰를 표시할 div
    const roadview = new kakao.maps.Roadview(roadviewContainer); //로드뷰 객체
    const roadviewClient = new kakao.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체

    const position = new kakao.maps.LatLng(latitude, longitude);

    // 특정 위치의 좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다.
    roadviewClient.getNearestPanoId(position, 50, function (panoId) {
      roadview.setPanoId(panoId, position); //panoId와 중심좌표를 통해 로드뷰 실행
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={roadviewDiv} style={{ width: "100%", height: "300px" }}></div>
  );
}
