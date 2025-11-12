import { Injectable } from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {LocalStoreService} from "./local-store.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {InitPaymentData, InitPaymentResponse, ServiceModel, ServiceType, Transaction} from "../../shared/interfaces";
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

  initPayment(data: InitPaymentData) {
    return this.post<InitPaymentResponse>('pay/init', data)
  }

  selectOptionPayment(data: { id: string, amount: number, optionId: string }) {
    return this.post<InitPaymentResponse>('pay/selectOption', data)
  }

  confirmPayment(data: { id: string, pin?: number, password?: string }) {
    return this.post<InitPaymentResponse>('pay/confirm', data)
  }

  downloadReceipt(transactionId: string) {
    return this.get<Blob>(`history/receipt`, {
      params: { transactionId: transactionId }, responseType: 'blob'
    });
  }

  getTrxDetail(transactionId: string) {
    return this.get<Transaction>(`history/detail`, { params: { transactionId: transactionId } });
  }

  getTrxHistory(filter: Record<string, string | number | boolean>, type?: string) {
    const url = type ? `/${type}` : '';
    return this.get<ListResponse<Transaction>>(`history${url}`, { params: filter })
  }

}
