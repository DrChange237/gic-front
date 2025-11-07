import { Injectable } from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {LocalStoreService} from "./local-store.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {BillerType} from "../../shared/interfaces";

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends BaseApiService {

  constructor(
      private store: LocalStoreService,
      private router: Router,
      protected http: HttpClient
  ) {
    super(http)
  }

}
