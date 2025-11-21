import { Injectable } from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {HttpClient} from "@angular/common/http";
import {
    AccountBalance,
    Agency,
    Cashier,
    OperationAccount,
    Role,
    StatsOperation,
    StatsService
} from "../../shared/interfaces";
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

    getStatsByService() {
        return this.get<StatsService[]>('dashboard/statsByBiller').pipe(
            catchError(error => {
                this.commonSrv.errorHandle(error, '', 'navigation.dashboard')
                return of(null);
            })
        );
    }

    getStatsMonths() {
        return this.get<StatsOperation[]>('dashboard/statsMonths').pipe(
            catchError(error => {
                this.commonSrv.errorHandle(error, '', 'navigation.dashboard')
                return of(null);
            })
        );
    }

  getListAgents(type: string) {
      const url = type === 'all' ? 'getCashiers' : 'getMyCashiers';
      return this.get<Cashier[]>(`cashier/${url}`);
  }

  updateCashierStatus(username: string, enabled: boolean) {
      return this.post<any>('cashier/enabled', { username, enabled });
  }

  updateCashierRole(data: { cashierId: string, roleId: string, password: string  }) {
      return this.post<any>('cashier/updateRole', data);
  }

  getListRoles() {
      return this.get<Role[]>('role/list');
  }
  getListAgencies() {
      return this.get<Agency[]>('agency/getMyAgencies');
  }

  getDetailAgency(agencyId: string) {
      return this.get<Agency>('agency/agencyInfo', { params: { agencyId } });
  }

  changAgencyStatus(agencyCode: string, enabled: boolean) {
      return this.post<any>('agency/enabled', { agencyCode, enabled });
  }

  getDetailRole(roleId: string) {
      return this.get<Role>('role/detail', { params: { roleId } });
  }

  getOperationAccount(agencyId: string) {
      return this.get<OperationAccount[]>(`agency/operationAccounts`, { params: { agencyId } });
  }

  updateAgencyAvailability(data: { agencyId: string, avaibility: string, password: string  }) {
      return this.post<any>('agency/openOrCloses', data);
  }
}
