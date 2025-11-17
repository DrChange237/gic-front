import {Authority} from "./user.interface";

export interface AgentInfo {
    id: string,
    code: string,
    name: string,
    parent: string,
    group: {
        id: string,
        name: string,
        minCommission: number
    },
    mode: 'AGENCY' | 'BANK'
    enabled: boolean,
    lastActivity: string | Date
}

export interface AgentGroup {
    id: string,
    name: string,
    slug: string,
    description: string
}

export interface Role {
    id: string,
    agent: AgentInfo,
    name: string,
    description: string,
    authorities: Authority[]
}

