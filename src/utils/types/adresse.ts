export interface Adresse {
  geometry: {
    coordinates: number[];
    type: string;
  };

  properties: {
    _type: string;
    banId: string;
    city: string;
    citycode: string;
    context: string;
    housenumber: string;
    id: string;
    importance: number;
    label: string;
    name: string;
    postcode: string;
    score: number;
    street: string;
    type: string;
    x: number;
    y: number;
  };
  type: string;
}
