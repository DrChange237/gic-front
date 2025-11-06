import { Injectable } from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {HttpClient} from "@angular/common/http";
import {AccountBalance} from "../../shared/interfaces";
import {catchError, of, tap} from "rxjs";
import {CommonService} from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseApiService {
  accountOperation: AccountBalance;
  accountCommission: AccountBalance;

  constructor(
      private commonSrv: CommonService,
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
        tap(res => this.accountCommission = res),
        catchError(error => {
          this.commonSrv.errorHandle(error, 'transactions.get_balance_trx_failed', 'transactions.balance')
          return of(null);
        })
    );
  }

}
