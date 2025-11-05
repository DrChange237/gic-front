import { Cashier } from "./user.interface";

export interface Credentials {
    username: string;
    password: string;
}

export interface AuthResponse {
  cashier: Cashier;
  token: string;
}