export interface TaskDetailsResponse {
  task: TaskInfo;
  processDefinition: ProcessDefinitionInfo;
  processVariables: { [key: string]: any };
  activityHistory: ActivityHistoryInfo[];
  activityUserTask : ActivityUserTaskInfo;
  documents : DocumentInfo[];
}

export interface FileInfo{
  id: string;
  name: string;
  url : string;
  type : string;
  size : number;
}

export interface DocumentInfo{
  label : string;
  file : FileInfo;
  creationDate : string | Date;
}

export interface TaskInfo {
  id: string;
  name: string;
  assignee?: string;
  createTime: string;      // ISO date
  dueDate?: string;
  processInstanceId: string;
  processDefinitionId: string;
  taskDefinitionKey: string;
  processDefinitionName : string;
  businessKey : string;
}

export interface ProcessDefinitionInfo {
  id: string;
  key: string;
  name: string;
  version: number;
  deploymentId: string;
}

export interface ActivityHistoryInfo {
  activityId: string;
  activityName?: string;
  activityType: string;      // userTask, serviceTask, startEvent, etc.
  startTime: string;
  endTime?: string;
  assignee?: string;
}

export interface ActivityUserTaskInfo{
    id : string;
    documentation : string;
    mapVariable : { [key: string]: any };
}