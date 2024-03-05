import { useUserStore } from "../../../store/mapStore";
import { addressSearchPromise } from "../../../api/houseApi";
import { HouseInfo, IpropsSearchResult } from "../../../commons/types/types";

export default function SearchResult(props: IpropsSearchResult) {
  const { setSelectedMarkerId, setLongLat } = useUserStore(); //setLongLat,

  const clickSearchResult = async (house: HouseInfo) => {
    setSelectedMarkerId(house.id);

    const data = await addressSearchPromise(house);
    if (data) {
      setLongLat({
        longitude: Number(data.x),
        latitude: Number(data.y),
      });
    }
  };

  if (
    props.propsData &&
    Array.isArray(props.propsData) &&
    props.propsData.length > 0
  ) {
    return (
      <ul>
        {props.propsData.map((house) => (
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
    );
  } else {
    return <div className="p-1">검색 결과 없음</div>;
  }
}
