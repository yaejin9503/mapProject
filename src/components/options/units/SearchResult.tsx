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

  if (data && Array.isArray(data) && data.length > 0) {
    return (
      data && (
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
      )
    );
  } else {
    if (props.query.length > 0)
      return (
        <div className="absolute mt-1 bg-white w-80 border border-[#9ca3af] rounded text-sm overflow-y-auto max-h-52">
          <div style={{ opacity: props.isStale ? 0.5 : 1 }}>
            <div className="p-1">검색 결과 없음</div>
          </div>
        </div>
      );
  }
}
