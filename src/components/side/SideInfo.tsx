/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { HouseInfo } from "../../commons/types/types";
import { useUserStore } from "../../store/mapStore";
import { useOptionStore } from "../../store/optionStore";
import KakaoMapRoadView from "../units/KakaoMapRoadView";
import { getSameAddressHouseData } from "../../api/houseApi";
import { BsChevronDoubleDown } from "@react-icons/all-files/bs/BsChevronDoubleDown";
import { FiChevronRight } from "@react-icons/all-files/fi/FiChevronRight";
import { useHouseStore } from "../../store/houseStore";
import { useLocation } from "react-router-dom";

export default function SideInfo() {
  const { selectedMarkerId, setSelectedMarkerId } = useUserStore();
  const { rank } = useOptionStore();
  const { notificationArrs, houseData } = useHouseStore();
  const [chkUnivStu, setChkUnivStu] = useState(false);
  const [originalData, setOriginalData] = useState<HouseInfo[]>([]);
  const [houses, setHouses] = useState<HouseInfo[]>([]);
  const location = useLocation();

  // if(location.path.split('/house'))

  useEffect(() => {
    if (location.pathname.includes("house")) {
      const id = location.pathname.split("/house/")[1];
      setSelectedMarkerId(Number(id));
    }
  }, [location]);

  const housesLength = originalData.length;
  const selectedHouse = houseData.find(
    (item) => item.id === Number(selectedMarkerId)
  );

  const oneNotification = notificationArrs.filter(
    (item) => item.id === selectedHouse?.notiType
  )[0];

  const filterPrice = (rank: number, chkUnivStu: boolean) => {
    const priceArrs = houses.filter(
      (house) => house.notSpaceAddress === selectedHouse?.notSpaceAddress
    );
    const result: { residentialType: string; deposit: number; rent: number }[] =
      [];

    priceArrs.forEach((house) => {
      let rent = 0;
      let deposit = 0;

      if (rank === 1) {
        if (chkUnivStu) {
          deposit = house.firstNumCollegeStudentDeposit;
          rent = house.firstNumCollegeStudentRent;
        } else {
          deposit = house.fristNumYouthDeposit;
          rent = house.firstNumYouthRent;
        }
      } else {
        if (chkUnivStu) {
          deposit = house.secondNumCollegeStudentDeposit;
          rent = house.secondNumCollegeStudentRent;
        } else {
          deposit = house.secondNumYouthDeposit;
          rent = house.secondNumYouthRent;
        }
      }
      result.push({
        residentialType: house.residentialType,
        deposit,
        rent,
      });
    });
    return result;
  };

  const depositRentArrs = useMemo(
    () => filterPrice(rank, chkUnivStu),
    [rank, chkUnivStu, houses]
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
  }, [selectedMarkerId]);

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
        <section className="z-50 flex-1 w-screen h-screen p-4 overflow-scroll text-black bg-white md:w-96">
          <div>
            <div className="flex justify-end mb-3">
              <button onClick={handleClickClose}>
                <FiChevronRight className="w-6 h-6" />
              </button>
            </div>
            <KakaoMapRoadView
              selectedLat={selectedHouse.latitude}
              selectedLng={selectedHouse.longitude}
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
            <div className="flex mb-3">
              <div className="font-bold">모집 일정</div>
              {new Date() < new Date(oneNotification.applicationEndDate) && (
                <div className="flex items-center px-2 py-1 ml-3 text-xs font-bold text-white rounded bg-sky-300 animate-bounce">
                  모집중✨
                </div>
              )}
            </div>
            <table className="w-full text-center border border-collapse table-fixed mb-7 border-slate-300">
              <tr>
                <th className="py-0.5 bg-slate-100">접수 시작</th>
                <td className="py-0.5">
                  {" "}
                  {oneNotification.applicationStartDate}
                </td>
              </tr>
              <tr>
                <th className="py-0.5 bg-slate-100">접수 종료</th>
                <td className="py-0.5">
                  {" "}
                  {oneNotification.applicationEndDate}
                </td>
              </tr>
              <tr>
                <th className="py-0.5 bg-slate-100">당첨자 발표</th>
                <td className="py-0.5">
                  {" "}
                  {oneNotification.applicationPassDate}
                </td>
              </tr>
            </table>
            <div className="flex justify-between mt-6">
              <div className="mb-3 font-bold">
                {rank === 1 ? "1순위" : "2-3순위"} 보증금
              </div>
              <div>
                {selectedHouse.typeName !== "청년안심주택" && (
                  <label>
                    <input
                      type="checkbox"
                      checked={chkUnivStu}
                      onChange={() => setChkUnivStu(!chkUnivStu)}
                    />
                    <span className="ml-1">대학생 입니다.</span>
                  </label>
                )}
              </div>
            </div>
            <table className="w-full text-center border border-collapse table-fixed mb-7 border-slate-300">
              <tr>
                <th className="w-1/5 py-0.5 bg-slate-100">타입</th>
                <th className="py-0.5 bg-slate-100">보증금</th>
                <th className="py-0.5  bg-slate-100">월세</th>
              </tr>
              {depositRentArrs?.map((item) => {
                return (
                  <tr>
                    <td className="py-0.5 overflow-auto text-center whitespace-nowrap">
                      {item.residentialType}
                    </td>
                    <td className="py-0.5">
                      {item.deposit.toLocaleString("ko-KR", {
                        style: "currency",
                        currency: "KRW",
                      })}
                    </td>
                    <td className="py-0.5">
                      {item.rent.toLocaleString("ko-KR", {
                        style: "currency",
                        currency: "KRW",
                      })}
                    </td>
                  </tr>
                );
              })}
            </table>
            <div className="mb-2 font-bold">주택 공급 정보</div>
            <div>
              <div className="flex w-full py-1 mb-2 border-b border-b-slate-300 text-slate-600">
                <div className="w-1/3 text-center">주택명</div>
                <div className="w-1/5 text-center">타입</div>
                <div className="w-1/4 text-center">
                  {selectedHouse.typeName.includes("안심")
                    ? "모집 호수(개)"
                    : "호수"}
                </div>
                {selectedHouse.typeName.includes("안심") ? (
                  <div className="w-1/4 text-center">신청 자격</div>
                ) : (
                  <div className="w-1/4 text-center">전용면적</div>
                )}
              </div>
              <div className="mt-2">
                {houses?.map((house) => {
                  return (
                    <div className="flex w-full p-1">
                      <div className="w-1/3 overflow-auto text-center whitespace-nowrap">
                        {house.houseName}
                      </div>
                      <div className="w-1/5 overflow-auto text-center whitespace-nowrap">
                        {house.residentialType}
                      </div>
                      <div className="w-1/4 text-center">
                        {house.typeName.includes("안심")
                          ? house.supply
                          : house.roomNum}
                      </div>
                      {house.typeName.includes("안심") ? (
                        <div className="w-1/4 text-center">
                          {house.ptype === "A"
                            ? "청년"
                            : house.ptype === "B1"
                            ? "신혼1"
                            : house.ptype === "B2"
                            ? "신혼2"
                            : "기타"}
                        </div>
                      ) : (
                        <div className="w-1/4 text-center">
                          {house.ExclusiveArea}
                        </div>
                      )}
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
            {/* <div>
              <a href="https://www.i-sh.co.kr/main/index.do" target="_blank">
                sh주택공사 바로가기
              </a>
            </div> */}
          </div>
        </section>
      )}
    </>
  );
}
