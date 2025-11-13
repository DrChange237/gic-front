import { Component, OnInit } from '@angular/core';
import {NgbHighlight, NgbInputDatepicker, NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectComponent} from "@ng-select/ng-select";
import {TranslatePipe} from "@ngx-translate/core";
import {CommonModule} from "@angular/common";
import {catchError, of} from "rxjs";
//
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import {AccountService} from "../../../core/services/account.service";
import {CommonService} from "../../../core/services/common.service";
import {Cashier} from "../../../shared/interfaces";
import {BaseListNonPagedComponent} from "../../../core/utils/base-list/base-list-unpaged.component";

@Component({
  selector: 'app-mgn-agents',
  templateUrl: './mgn-agents.component.html',
  styleUrls: ['./mgn-agents.component.scss'],
  imports: [CommonModule, SharedComponentsModule, FormsModule, NgSelectComponent, NgbHighlight, NgbInputDatepicker,
    NgbPagination, ReactiveFormsModule, TranslatePipe, NgbTooltip],
  standalone: true
})
export class MgnAgentsComponent extends BaseListNonPagedComponent<Cashier> implements OnInit {

  constructor(
      private commonSrv: CommonService,
      private accountSrv: AccountService,
  ) {
    super();
  }

  override fetchData() {
    return this.accountSrv.getListAgents().pipe(
        catchError(err => {
          this.commonSrv.errorHandle(err, 'account.get_agent_list_failed', 'account.agent');
          return of(null);
        })
    );
  }

  protected override filterData(items: Cashier[], filter: string): Cashier[] {
    const lowerTerm = filter.toLowerCase();
    return items.filter(agent =>
        agent.name?.toLowerCase()?.includes(lowerTerm) ||
        agent.agency.name?.toLowerCase()?.includes(lowerTerm) ||
        agent.role.name?.toLowerCase()?.includes(lowerTerm) ||
        agent.username?.toLowerCase()?.includes(lowerTerm)
    );
  }

}
