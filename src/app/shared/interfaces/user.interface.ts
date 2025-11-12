import { Town } from "./config.interface";

export interface Account {
  id: string;
  agencyCode: string;
  accountNumber: string;
  accountKey: string;
  title: string;
}

export interface Group {
  id: string;
  name: string;
  minCommission: number;
}

export interface Agent {
  id: string;
  code: string;
  name: string;
  parent: string;
  group: Group;
  enabled: boolean;
  lastActivity: string; // ISO date string
}

export interface Agency {
  id: string;
  town: Town;
  agent: Agent;
  account: Account;
  name: string;
  accountCommission: Account;
  code: string;
  enabled: boolean;
  fixed: boolean;
  status: boolean;
  longitude: number;
  lattitude: number;
  address: string;
  lastActivity: string; // ISO date string
}

export interface Authority {
  id: string;
  name: string;
  description: string;
}

export interface Lang {
  id: string;
  name: string;
  flag: string;
  code: string;
}

export interface Cashier {
  id: string;
  agency: Agency;
  role: Role;
  name: string;
  username: string;
  lastActivity: string; // ISO date string
  lang: Lang;
}

export interface Role {
  id: string,
  agent: {
    id: string,
    code: string,
    name: string,
    parent: string,
    group: {
      id: string,
      name: string,
      minCommission: number
    },
    enabled: boolean,
    lastActivity: string | Date
  },
  name: string,
  authorities: Authority[]
}
