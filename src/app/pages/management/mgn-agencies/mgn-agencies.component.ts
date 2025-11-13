import { Component, OnInit } from '@angular/core';
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import {CommonModule} from "@angular/common";
import {BaseListNonPagedComponent} from "../../../core/utils/base-list/base-list-unpaged.component";
import {Agency} from "../../../shared/interfaces";
import {catchError, of} from "rxjs";
import {CommonService} from "../../../core/services/common.service";
import {AccountService} from "../../../core/services/account.service";
import {FormsModule} from "@angular/forms";
import {NgSelectComponent} from "@ng-select/ng-select";
import {NgbHighlight, NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-mgn-agencies',
  templateUrl: './mgn-agencies.component.html',
  styleUrls: ['./mgn-agencies.component.scss'],
  imports: [CommonModule, SharedComponentsModule, FormsModule, NgSelectComponent, NgbHighlight, NgbPagination, TranslatePipe, NgbTooltip],
  standalone: true
})
export class MgnAgenciesComponent extends BaseListNonPagedComponent<Agency> implements OnInit {

  constructor(
      private accountSrv: AccountService,
      private commonSrv: CommonService
  ) {
    super();
  }

  override fetchData() {
    return this.accountSrv.getListAgencies().pipe(
        catchError(err => {
          this.commonSrv.errorHandle(err, 'account.get_agency_list_failed', 'account.role');
          return of(null);
        })
    );
  }

  protected override filterData(items: Agency[], filter: string): Agency[] {
    const lowerTerm = filter.toLowerCase();
    return items.filter(agency =>
        agency.name?.toLowerCase()?.includes(lowerTerm) ||
        agency.address?.toLowerCase()?.includes(lowerTerm) ||
        agency.town.name?.toLowerCase()?.includes(lowerTerm) ||
        agency.account.accountNumber?.toLowerCase()?.includes(lowerTerm)
    );
  }

}
