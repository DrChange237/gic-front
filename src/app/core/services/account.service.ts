import { Injectable } from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {HttpClient} from "@angular/common/http";
import {AccountBalance, AgentInfo} from "../../shared/interfaces";
import {catchError, of, tap} from "rxjs";
import {CommonService} from "./common.service";
import {ListResponse} from "../utils/base-list/base-list.component";

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
      tap(res => this.accountOperation = res),
      catchError(error => {
        this.commonSrv.errorHandle(error, 'account.get_balance_trx_failed', 'account.account_balance')
        return of(null);
      })
    );
  }

  getAccountCommission() {
    return this.get<AccountBalance>('cashier/balance').pipe(
        tap(res => this.accountCommission = res),
        catchError(error => {
          this.commonSrv.errorHandle(error, 'account.get_balance_fees_failed', 'account.account_balance')
          return of(null);
        })
    );
  }

  getAgents(filter: Record<string, string | number | boolean>) {
      return this.get<ListResponse<AgentInfo>>('admin/agent/getAll', { params: filter });
  }

}
