export interface Cordinates {
  lng: number;
  lat: number;
}
export interface PlcaeLocation extends Cordinates {
  address: string;
  staticMapImageUrl: string;
}
