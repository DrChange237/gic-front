import { Injectable } from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {HttpClient} from "@angular/common/http";
import {
  AccountBalance,
  CompleteTask,
  InitPaymentData,
  InitPaymentResponse,
  InitTransfertFund,
  ModuleModel,
  ProcessModel,
  ProcessStartRequest,
  ProcessStartResponse,
  ServiceModel,
  ServiceType,
  TaskModel,
  Transaction
} from "../../shared/interfaces";
import {ListResponse} from "../utils/base-list/base-list.component";
import { FormResponse } from 'src/app/shared/interfaces/form.interface';
import { TaskDetailsResponse } from 'src/app/shared/interfaces/task.interfaces';

@Injectable({
  providedIn: 'root'
})
export class FactoryService extends BaseApiService {

  constructor(
      protected http: HttpClient
  ) {
    super(http)
  }

  getServiceTypes() {
    return this.get<ServiceType[]>('bill/types');
  }

  getServices(type: string) {
    return this.get<ServiceModel[]>('bill/billers', { params: { type } });
  }

  getProcessDefinition(moduleId : string) {
    return this.get<ProcessModel[]>('process', { params: { moduleId } });
  }

  getProcesses() {
    return this.get<ProcessModel[]>('process/all');
  }

  getModules() {
    return this.get<ModuleModel[]>('module');
  }

  getMyTasks() {
    return this.get<TaskModel[]>('tasks/my');
  }

  getTasks() {
    return this.get<TaskModel[]>('tasks/all');
  }

  searchTasks(businessKey : string) {
    return this.get<TaskModel[]>('tasks/bykey', { params : { businessKey }});
  }

  claimTask(taskId : string) {
    return this.get<boolean>('tasks/claim', { params : { taskId }});
  }

  unClaimTask(taskId : string) {
    return this.get<boolean>('tasks/unclaim', { params : { taskId }});
  }

  detailTask(taskId : string) {
    return this.get<TaskDetailsResponse>('tasks/full', { params : { taskId }});
  }

  getInitForm(processKey : string){
     return this.get<FormResponse>('camunda/forms/start', { params : { processKey }});
  }

  getTaskForm(taskId : string){
     return this.get<FormResponse>('camunda/forms/start/task', { params : { taskId }});
  }

  getTaskVariables(taskId : string){
     return this.get<FormResponse>('camunda/forms/form-variables', { params : { taskId }});
  }

  startProcess(request: ProcessStartRequest) {
    return this.post<ProcessStartResponse>('process/start', request);
  }

  completeTask(request: CompleteTask) {
    return this.post<ProcessStartResponse>('tasks/complete', request);
  }

  getBalanceOperationAccount(agencyCode: string, billerCode: string) {
    return this.get<AccountBalance>('agency/operationBalance', { params: { agencyCode, billerCode } });
  }

  initPayment(data: InitPaymentData) {
    return this.post<InitPaymentResponse>('pay/init', data)
  }

  selectOptionPayment(data: { id: string, amount: number, optionId: string }) {
    return this.post<InitPaymentResponse>('pay/selectOption', data)
  }

  confirmPayment(data: { id: string, pin?: number, password?: string }) {
    return this.post<InitPaymentResponse>('pay/confirm', data)
  }

  transferToAgency(data: InitTransfertFund) {
    return this.post<any>('operation/tranferToAgency', data)
  }

  downloadReceipt(transactionId: string) {
    return this.get<Blob>(`history/receipt`, {
      params: { transactionId: transactionId }, responseType: 'blob'
    });
  }

  getTrxDetail(transactionId: string) {
    return this.get<Transaction>(`history/detail`, { params: { transactionId } });
  }

  getTrxHistory(filter: Record<string, string | number | boolean>, type?: string, entityId?: string) {
    const url1 = type ? `/${type}` : '';
    const url2 = entityId ? `/all` : '';
    return this.get<ListResponse<Transaction>>(`history${url1}${url2}`, { params: filter })
  }

}
