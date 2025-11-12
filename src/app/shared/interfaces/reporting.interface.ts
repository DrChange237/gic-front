import {AgentInfo} from "./user.interface";

export interface Report {
    id: string,
    name: string,
    agent: AgentInfo,
    description: string,
    file: string,
    fileType: string,
    creationDate: string
}
