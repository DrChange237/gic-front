import {Component, OnInit, TemplateRef,} from '@angular/core';
import {NgSelectComponent} from "@ng-select/ng-select";
import {NgbHighlight, NgbModal, NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {TranslatePipe} from "@ngx-translate/core";
import {catchError, Observable, of} from "rxjs";
import {CommonModule} from "@angular/common";
import {NgScrollbar} from "ngx-scrollbar";
import {FormsModule} from "@angular/forms";
//
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import {BaseListNonPagedComponent} from "../../../core/utils/base-list/base-list-unpaged.component";
import {Role,} from "../../../shared/interfaces";
import {AccountService} from "../../../core/services/account.service";
import {CommonService} from "../../../core/services/common.service";
import {TableDetailComponent} from "../../../shared/components/table-detail/table-detail.component";

@Component({
  selector: 'app-mgn-role',
  templateUrl: './mgn-role.component.html',
  styleUrls: ['./mgn-role.component.scss'],
  imports: [CommonModule, SharedComponentsModule, FormsModule, NgSelectComponent, NgbHighlight, NgbPagination, TranslatePipe, NgbTooltip, NgScrollbar, TableDetailComponent],
  standalone: true
})
export class MgnRoleComponent extends BaseListNonPagedComponent<Role> implements OnInit {

  currRole: Role;
  modalAction: string = '';
  datasRole: { key: string; label: string; value: string }[];
  authorities: { key: string; label: string, value: string }[];

  constructor(
      private modalService: NgbModal,
      private accountSrv: AccountService,
      private commonSrv: CommonService,
  ) {
    super()
  }

  override fetchData(): Observable<Role[]> {
    return this.accountSrv.getListRoles().pipe(
        catchError(err => {
          this.commonSrv.errorHandle(err, 'account.get_agent_list_failed', 'account.role');
          return of(null);
        })
    );
  }

  filterData(items: Role[], filter: string): Role[] {
    const lowerTerm = filter.toLowerCase();
    return items?.filter(role =>
        role.name?.toLowerCase()?.includes(lowerTerm) ||
        role.description?.toLowerCase()?.includes(lowerTerm)
    );
  }

  openModal(content: TemplateRef<never>,  role: Role, action: 'DETAIL' | 'AUTH') {
    if (!role) return;

    this.accountSrv.getDetailRole(role.id).subscribe({
      next: res => {
        this.currRole = res;
        this.modalAction = action;
        if (action === 'DETAIL') {
          this.datasRole = this.commonSrv.objectToDisplayList(role, ['id', 'authorities', 'agent']);
          this.datasRole.push({
            key: 'authorities',
            label: 'table.authorities',
            value: `${role.authorities.map(r => r.name).join(' - ')}` || 'N/A'
          })
        }

        if (action === 'AUTH') {
          this.authorities = role.authorities.map(r => ({ key: r.id, label: r.name, value: r.description }));
        }
        this.modalService.open(content, { size: "lg", ariaLabelledBy: 'modal-basic-title', centered: true })
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.get_detail_transaction_failed', 'account.role')
    });
  }

}
