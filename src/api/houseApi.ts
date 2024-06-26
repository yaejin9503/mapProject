import {
  HouseInfo,
  AddressFucResult,
  Notification,
} from "../commons/types/types";
import uniqBy from "lodash-es/uniqBy";

// 공고 데이터 가져오는 함수
export const getNotification = async (): Promise<Notification[]> => {
  const result = await fetch(
    "https://pulic-rent-housing-default-rtdb.firebaseio.com/notification.json"
  );
  const items = await result.json();
  return items;
};

// 원본 데이터 가져오는 함수
export const getHouseData = async (): Promise<HouseInfo[]> => {
  const result = await fetch(
    "https://pulic-rent-housing-default-rtdb.firebaseio.com/houses.json"
  );
  const items = await result.json();

  return items;
};

const houseAddressEdit = (houses: HouseInfo[]) => {
  return houses.map((house: HouseInfo) => {
    house.notSpaceAddress = house.address
      .slice(0, house.address.indexOf("("))
      .replace("서울특별시", "서울")
      .split(" ")
      .join("")
      .trim();
    house.address = house.address.slice(0, house.address.indexOf("("));
    return house;
  });
};

//id와 주소가 같은 데이터만 가져오는 함수
export const getSameAddressHouseData = async (id: number) => {
  const houseData = await getHouseData();
  const houseArray = houseAddressEdit(houseData);
  const sameAddress = houseArray.filter((house) => house.id === id)[0]
    ?.notSpaceAddress;
  return houseArray.filter((house) => house.notSpaceAddress == sameAddress);
};

// 중복 주소 제거한 데이터 가져오는 함수
export const uniqHouseData = async () => {
  const houseData = await getHouseData();
  const houseArray = houseAddressEdit(houseData);
  const notDupplicate: Array<HouseInfo> = uniqBy(houseArray, "notSpaceAddress");
  return notDupplicate;
};

// 경도, 위도 구하는 함수
export const addressSearchPromise = async (
  house: HouseInfo
): Promise<AddressFucResult> => {
  const geocoder = new kakao.maps.services.Geocoder(); // 장소 검색 서비스 객체를 생성한다.
  return new Promise((resolve) => {
    geocoder.addressSearch(
      house.address,
      (result: Array<AddressFucResult>, status: kakao.maps.services.Status) => {
        if (status == "OK" && status === kakao.maps.services.Status.OK) {
          resolve(result[0]);
        }
      }
    );
  });
};

// 주소에 맞는 위도, 경도 추가하는 함수
export const houseWithGeocoder = async () => {
  const _uniqHouseData: HouseInfo[] = await uniqHouseData();

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

// 집 찾는 함수
export const findHouses = async (str: string) => {
  if (str) {
    const _houseWithGeocoder = await uniqHouseData();
    if (_houseWithGeocoder) {
      return _houseWithGeocoder.filter(
        (house) => house.houseName.includes(str) || house.address.includes(str)
      );
    }
  } else {
    return [];
  }
};
