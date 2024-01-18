export type IPropsMap = { 
  latitude: number
  longitude: number
  data: Array<HouseInfo> 
}

export type HouseInfo = {
  id: number,
  typeName: string,
  category: string,
  borough: string,
  houseName: string,
  address: string,
  notSpaceAddress: string, 
  roomNum: string,
  residentialType: string,
  houseStructure: string,
  gender: string,
  ExclusiveArea: number,
  fristNumYouthDeposit: number,
  firstNumYouthRent: number,
  firstNumCollegeStudentDeposit: number,
  firstNumCollegeStudentRent: number,
  secondNumYouthDeposit: number,
  secondNumYouthRent: number,
  secondNumCollegeStudentDeposit: number,
  secondNumCollegeStudentRent: number,
  longitude: number,
  latitude: number
};

export type MarkerInfo = { 
  content : string, 
  latlng: kakao.maps.LatLng
}

export type AddressFucResult = { 
  address_name: string, 
  address_type: string, 
  x: string, 
  y: string, 
  address: kakao.maps.services.Address, 
  road_address: kakao.maps.services.RoadAaddress
}

export interface Coordinate {
  longitude: number;
  latitude: number;
}