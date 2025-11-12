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
    enabled: boolean,
    lastActivity: string | Date
}

export interface AgentGroup {
    id: string,
    name: string,
    slug: string,
    description: string
}
