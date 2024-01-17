export { };

declare global {
  interface Window {
    kakao: kakao.maps;
  }
}

export interface Coordinate {
  longitude: number,
  latitude: number
}