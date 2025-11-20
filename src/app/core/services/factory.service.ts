import { Injectable } from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {HttpClient} from "@angular/common/http";
import {
  AccountBalance,
  InitPaymentData,
  InitPaymentResponse,
  InitTransfertFund, OperationAccount,
  ServiceModel,
  ServiceType,
  Transaction
} from "../../shared/interfaces";
import {ListResponse} from "../utils/base-list/base-list.component";

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

  getOperationAccount(agencyId: string) {
    return this.get<OperationAccount>(`agency/operationAccounts`, { params: { agencyId } });
  }

}
