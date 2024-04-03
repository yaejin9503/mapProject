export type IPropsMap = {
  data: Array<HouseInfo>;
};

export type HouseInfo = {
  id: number;
  typeName: string;
  type: string;
  category: string;
  borough: string;
  houseName: string;
  address: string;
  notSpaceAddress: string;
  roomNum: string;
  residentialType: string;
  houseStructure: string;
  gender: string;
  ExclusiveArea: number;
  fristNumYouthDeposit: number;
  firstNumYouthRent: number;
  firstNumCollegeStudentDeposit: number;
  firstNumCollegeStudentRent: number;
  secondNumYouthDeposit: number;
  secondNumYouthRent: number;
  secondNumCollegeStudentDeposit: number;
  secondNumCollegeStudentRent: number;
  longitude: number;
  latitude: number;
  selected?: boolean;
  supply?: number | string;
  ptype?: string;
  notiType: string;
};

export type MarkerInfo = {
  content: HTMLElement | string;
  latlng: kakao.maps.LatLng;
};

export type AddressFucResult = {
  address_name: string;
  address_type: string;
  x: string;
  y: string;
  address: kakao.maps.services.Address;
  road_address: kakao.maps.services.RoadAaddress;
};

export interface Coordinate {
  longitude: number;
  latitude: number;
}

export interface IpropsSearchResult {
  query: string;
  isStale: boolean;
}

export type Notification = {
  id: string;
  year: number;
  count: 1;
  name: string;
  applicationStartDate: string;
  applicationEndDate: string;
  applicationPassDate: string;
  documentStartDate: string;
  documentEndDate: string;
  finalPass: string;
  moveInDate: string;
  url: string;
};
