export interface User {
  id?: number;
  token:string
  email: string;
  password: string;
}

export interface City {
  id?: number;
  type: string;
  address: string;
}
