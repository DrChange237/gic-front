import { Injectable } from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {HttpClient} from "@angular/common/http";
import {AccountBalance} from "../../shared/interfaces";
import {tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseApiService {
  accountOperation: AccountBalance;
  accountCommission: AccountBalance;

  constructor(
      protected http: HttpClient
  ) {
    super(http)
  }

  getAccountOperation() {
    return this.get<AccountBalance>('cashier/balance').pipe(
      tap(res => this.accountOperation = res)
    );
  }

  getAccountCommission() {
    return this.get<AccountBalance>('cashier/balance').pipe(
        tap(res => this.accountCommission = res)
    );
  }

}
