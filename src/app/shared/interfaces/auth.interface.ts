import { Cashier } from "./user.interface";

export interface Credentials {
    username: string;
    password: string;
}

export interface AuthResponse {
  user: Cashier;
  token: string;
}