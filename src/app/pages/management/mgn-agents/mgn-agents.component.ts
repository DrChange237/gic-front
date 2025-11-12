import { Component, OnInit } from '@angular/core';
import {NgbHighlight, NgbInputDatepicker, NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectComponent} from "@ng-select/ng-select";
import {TranslatePipe} from "@ngx-translate/core";
import {CommonModule} from "@angular/common";
import {catchError, of} from "rxjs";
//
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import {BaseListComponent, ListQuery} from "../../../core/utils/base-list/base-list.component";
import {AccountService} from "../../../core/services/account.service";
import {CommonService} from "../../../core/services/common.service";
import {AgentInfo} from "../../../shared/interfaces";

@Component({
  selector: 'app-mgn-agents',
  templateUrl: './mgn-agents.component.html',
  styleUrls: ['./mgn-agents.component.scss'],
  imports: [CommonModule, SharedComponentsModule, FormsModule, NgSelectComponent, NgbHighlight, NgbInputDatepicker, NgbPagination, ReactiveFormsModule, TranslatePipe, NgbTooltip],
  standalone: true
})
export class MgnAgentsComponent extends BaseListComponent<AgentInfo> implements OnInit {

  constructor(
      private commonSrv: CommonService,
      private accountSrv: AccountService,
  ) {
    super();
  }

  override search() { this.load(); }

  override fetchData(query: ListQuery) {
    return this.accountSrv.getAgents(query).pipe(
        catchError(err => {
          this.commonSrv.errorHandle(err, 'account.get_agent_list_failed', 'account.agent');
          return of(null);
        })
    );
  }

  protected override filterData(items: AgentInfo[], filter: string): AgentInfo[] {
    const lowerTerm = filter.toLowerCase();
    return items.filter(report =>
        report.name?.toLowerCase()?.includes(lowerTerm) ||
        report.code?.toLowerCase()?.includes(lowerTerm)
    );
  }

}
