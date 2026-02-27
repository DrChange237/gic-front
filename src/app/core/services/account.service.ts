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
        return this.get<AccountBalance>('cashier/commission').pipe(
            tap(res => this.accountCommission = res)
        );
    }

    getStatsByService() {
        return this.get<StatsService[]>('dashboard/statsByBiller');
    }

    getStatsMonths() {
        return this.get<StatsOperation[]>('dashboard/statsMonths');
    }

  getListAgents(type: string) {
      const url = type === 'all' ? 'getCashiers' : 'getMyCashiers';
      return this.get<Cashier[]>(`user`);
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
