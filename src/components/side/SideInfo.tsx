/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { HouseInfo, IPropsMap } from "../../commons/types/types";
import { useUserStore } from "../../store/mapStore";
import { useOptionStore } from "../../store/optionStore";
import KakaoMapRoadView from "../units/KakaoMapRoadView";
import { getSameAddressHouseData } from "../../api/houseApi";
import { BsChevronDoubleDown } from "react-icons/bs";
import { FiChevronRight } from "react-icons/fi";

export default function SideInfo(props: IPropsMap) {
  const { selectedMarkerId, setSelectedMarkerId } = useUserStore();
  const { rank } = useOptionStore();
  const [chkUnivStu, setChkUnivStu] = useState(false);
  const [originalData, setOriginalData] = useState<HouseInfo[]>([]);
  const [houses, setHouses] = useState<HouseInfo[]>([]);

  const housesLength = originalData.length;
  const selectedHouse = props.data?.find(
    (item) => item.id === Number(selectedMarkerId)
  );

  const filterPrice = (rank: number, chkUnivStu: boolean, type: string) => {
    if (rank === 1 && chkUnivStu) {
      return type === "deposit"
        ? selectedHouse?.firstNumCollegeStudentDeposit
        : selectedHouse?.firstNumCollegeStudentRent;
    } else if (rank === 2 && chkUnivStu) {
      return type === "deposit"
        ? selectedHouse?.secondNumCollegeStudentDeposit
        : selectedHouse?.secondNumCollegeStudentRent;
    } else if (rank === 1) {
      return type === "deposit"
        ? selectedHouse?.fristNumYouthDeposit
        : selectedHouse?.firstNumYouthRent;
    } else {
      return type === "deposit"
        ? selectedHouse?.secondNumYouthDeposit
        : selectedHouse?.secondNumYouthRent;
    }
  };

  const deposit = useMemo(
    () => filterPrice(rank, chkUnivStu, "deposit"),
    [rank, chkUnivStu]
  );
  const rent = useMemo(
    () => filterPrice(rank, chkUnivStu, "rent"),
    [rank, chkUnivStu]
  );

  useEffect(() => {
    const getHoues = async () => {
      const data = await getSameAddressHouseData(selectedMarkerId);
      setOriginalData(data);
      if (data && Array.isArray(data) && data.length) {
        if (data.length > 5) {
          setHouses(data.slice(0, 5));
        } else {
          setHouses(data);
        }
      }
    };
    getHoues();
  }, []);

  const handleClickMoreBtn = () => {
    const data = houses.concat(
      originalData.slice(houses.length, houses.length + 5)
    );
    setHouses(data);
  };

  const handleClickClose = () => {
    setSelectedMarkerId(0);
  };

  return (
    <>
      {selectedHouse && (
        <section className="flex-1 h-screen p-4 overflow-scroll text-black bg-white w-96">
          <div>
            <div className="flex justify-end mb-3">
              <button onClick={handleClickClose}>
                <FiChevronRight className="w-6 h-6" />
              </button>
            </div>
            <KakaoMapRoadView
            // selectedLat={selectedHouse.latitude}
            // selectedLng={selectedHouse.longitude}
            />
            <div className="mt-2 mb-2">
              <span className="px-2 py-0.5 border border-green-600 rounded-md text-sm text-green-600">
                {selectedHouse.type}
              </span>
              <span className="ml-2 px-2 py-0.5 border border-orange-400 rounded-md text-sm text-orange-400">
                {selectedHouse.typeName}
              </span>
            </div>
            <h2 className="text-xl font-bold">{selectedHouse.houseName}</h2>
            <div className="mb-5">{selectedHouse.address}</div>
            <div className="flex justify-between mb-3">
              <div className="font-bold">
                {rank === 1 ? "1순위" : "2-3순위"} 보증금
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={chkUnivStu}
                    onChange={() => setChkUnivStu(!chkUnivStu)}
                  />
                  <span className="ml-1">대학생 입니다.</span>
                </label>
              </div>
            </div>
            <table className="w-full text-center border border-collapse table-fixed mb-7 border-slate-300">
              <tr>
                <th className="py-0.5 bg-slate-100">보증금</th>
                <th className="py-0.5  bg-slate-100">월세</th>
              </tr>
              <tr>
                <td className="py-0.5">
                  {deposit?.toLocaleString("ko-KR", {
                    style: "currency",
                    currency: "KRW",
                  })}
                </td>
                <td className="py-0.5">
                  {rent?.toLocaleString("ko-KR", {
                    style: "currency",
                    currency: "KRW",
                  })}
                </td>
              </tr>
            </table>
            <div className="mb-2 font-bold">주택 공급 정보</div>
            <div>
              <div className="flex w-full py-1 mb-2 border-b border-b-slate-300 text-slate-600">
                <div className="w-1/3 text-center">주택명</div>
                <div className="w-1/5 text-center">타입</div>
                <div className="w-1/4 text-center">호수</div>
                <div className="w-1/4 text-center">전용면적</div>
              </div>
              <div className="mt-2">
                {houses?.map((house) => {
                  return (
                    <div className="flex w-full p-1">
                      <div className="w-1/3 text-center">{house.houseName}</div>
                      <div className="w-1/5 text-center">
                        {house.residentialType}
                      </div>
                      <div className="w-1/4 text-center">{house?.roomNum}</div>
                      <div className="w-1/4 text-center">
                        {house.ExclusiveArea}
                      </div>
                    </div>
                  );
                })}
                {housesLength > houses?.length && (
                  <button
                    className="flex items-center justify-center w-full mt-2 text-slate-600"
                    onClick={handleClickMoreBtn}
                  >
                    더보기
                    <BsChevronDoubleDown className="ml-1" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
