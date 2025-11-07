import { Injectable } from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {LocalStoreService} from "./local-store.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ServiceModel, ServiceType} from "../../shared/interfaces";

@Injectable({
  providedIn: 'root'
})
export class FactoryService extends BaseApiService {

  constructor(
      private store: LocalStoreService,
      private router: Router,
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

}
