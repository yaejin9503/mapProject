import { useUserStore } from "../../../store/mapStore";
import { addressSearchPromise, findHouses } from "../../../api/houseApi";
import { HouseInfo, IpropsSearchResult } from "../../../commons/types/types";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function SearchResult(props: IpropsSearchResult) {
  const { setSelectedMarkerId, setLongLat } = useUserStore(); //setLongLat,

  const { data } = useSuspenseQuery({
    queryKey: ["deferredValue", props.query],
    queryFn: async () => await findHouses(props.query),
  });

  const clickSearchResult = async (house: HouseInfo) => {
    setSelectedMarkerId(house.id);

    const houses = await addressSearchPromise(house);
    if (houses) {
      setLongLat({
        longitude: Number(houses.x),
        latitude: Number(houses.y),
      });
    }
  };

  /**
   * 1. 쿼리가 없음: 쿼리가 없을 때는 아예 이 컴포넌트를 렌더할 필요성이없다.
   * 2. 쿼리에 해당하는 검색결과가 없음: 검색결과 없음.
   * 3. 검색결과 있음: 리스트를 리턴
   */

  if (!data) {
    return <></>;
  }

  if (props.query.length > 0) {
    if (Array.isArray(data) && data.length > 0) {
      return (
        <div className="absolute mt-1 bg-white w-80 border border-[#9ca3af] rounded text-sm overflow-y-auto max-h-52">
          <div style={{ opacity: props.isStale ? 0.5 : 1 }}>
            <ul>
              {data.map((house) => (
                <li
                  className="p-3 border-b cursor-pointer border-b-gray-300 hover:bg-neutral-100"
                  onClick={() => clickSearchResult(house)}
                  key={house.id + house.houseStructure}
                >
                  <div className="text-sm">{house.houseName}</div>
                  <div className="text-xs">{house.address}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    } else {
      return (
        <div className="absolute mt-1 bg-white w-80 border border-[#9ca3af] rounded text-sm overflow-y-auto max-h-52">
          <div style={{ opacity: props.isStale ? 0.5 : 1 }}>
            <div className="p-1">검색 결과 없음</div>
          </div>
        </div>
      );
    }
  }
}
