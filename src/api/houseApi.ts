import { HouseInfo, AddressFucResult } from "../commons/types/types";
import _ from "lodash";

// 원본 데이터 가져오는 함수
export const getHouseData = async (): Promise<HouseInfo[]> => {
  const result = await fetch("./src/api/house.json");
  const { items } = await result.json();

  return items;
};

// 중복 주소 제거한 데이터 가져오는 함수
export const uniqHouseData = async () => {
  const houseData = await getHouseData();
  const houseArray: Array<HouseInfo> = houseData.map((house: HouseInfo) => {
    house.notSpaceAddress = house.address
      .slice(0, house.address.indexOf("("))
      .replace("서울특별시", "서울")
      .split(" ")
      .join("")
      .trim();
    return house;
  });

  const notDupplicate: Array<HouseInfo> = _.uniqBy(
    houseArray,
    "notSpaceAddress"
  );
  return notDupplicate;
};

// 주소에 맞는 위도, 경도 추가하는 함수
export const houseWithGeocoder = async () => {
  const _uniqHouseData: HouseInfo[] = await uniqHouseData();
  const geocoder = new kakao.maps.services.Geocoder(); // 장소 검색 서비스 객체를 생성한다.

  const addressSearchPromise = (
    house: HouseInfo
  ): Promise<AddressFucResult> => {
    return new Promise((resolve) => {
      geocoder.addressSearch(
        house.address,
        (
          result: Array<AddressFucResult>,
          status: kakao.maps.services.Status
        ) => {
          if (status == "OK" && status === kakao.maps.services.Status.OK) {
            resolve(result[0]);
          }
        }
      );
    });
  };

  try {
    const returnData = await Promise.all(
      _uniqHouseData.map((house) => addressSearchPromise(house))
    );
    if (!returnData) return;

    const geocoderData = _uniqHouseData.map((house) => {
      const findAddress = returnData.filter(
        (data) =>
          data.address_name.split(" ").join("").trim() === house.notSpaceAddress
      );
      if (findAddress && Array.isArray(findAddress) && findAddress.length > 0) {
        house.longitude = Number(findAddress[0].x);
        house.latitude = Number(findAddress[0].y);
      }
      return house;
    });

    return geocoderData;
  } catch (e) {
    console.error("error message:", e);
  }
};
