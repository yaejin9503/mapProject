export {}; 

declare global {
   interface Window {
    kakao: any;
  }
} 

export interface Coordinate{ 
  longitude: number, 
  latitude: number
}