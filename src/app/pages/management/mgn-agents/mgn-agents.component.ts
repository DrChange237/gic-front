import {Component, OnInit} from '@angular/core';
import {NgbHighlight, NgbModal, NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
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
import {SharedPipesModule} from "../../../shared/pipes/shared-pipes.module";
import {
  ConfirmActionModalComponent
} from "../../../shared/components/confirm-action-modal/confirm-action-modal.component";
import {ActionResultModalComponent} from "../../../shared/components/action-result-modal/action-result-modal.component";
import {ActivatedRoute} from "@angular/router";
import {Permission} from "../../../shared/enums/permission";
import {HasPermissionDirective} from "../../../shared/directives/permission.directive";

@Component({
  selector: 'app-mgn-agents',
  templateUrl: './mgn-agents.component.html',
  styleUrls: ['./mgn-agents.component.scss'],
  imports: [CommonModule, SharedPipesModule, SharedComponentsModule, FormsModule, NgSelectComponent, NgbHighlight,
    NgbPagination, ReactiveFormsModule, TranslatePipe, NgbTooltip, HasPermissionDirective],
  standalone: true
})
export class MgnAgentsComponent extends BaseListNonPagedComponent<Cashier> implements OnInit {

  listType: string = '';

  protected readonly Permission = Permission;

  constructor(
      private modalService: NgbModal,
      private commonSrv: CommonService,
      private accountSrv: AccountService,
      private route: ActivatedRoute,
  ) {
    super();
    this.listType = this.route.snapshot.data['all'];
  }

  override fetchData() {
    return this.accountSrv.getListAgents(this.listType).pipe(
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

  viewHistoryAgent(cashier: Cashier){
    const param = this.commonSrv.secureSrv.encryptParams({id: cashier.id, name: cashier.name});
    this.commonSrv.router.navigate(['transactions/history/agent', param])
  }

  openConfirmModal(cashier: Cashier) {
    const modalRef = this.modalService.open(ConfirmActionModalComponent, {
      centered: true, backdrop: 'static',
    });

    modalRef.componentInstance.title = cashier.enabled ? 'modal.disable' : 'modal.enable';
    modalRef.componentInstance.message = this.commonSrv.translate.instant(
        cashier.enabled ? 'modal.disable_message' : 'modal.enable_message',
        { name: cashier.name });
    modalRef.componentInstance.withoutAuth = true;

    modalRef.result.then((res: string) => res && this.onChangeStatusAgent(cashier));
  }

  onChangeStatusAgent(cashier: Cashier) {
    this.accountSrv.changCashierStatus(cashier.username, !cashier.enabled).subscribe({
      next: () => {
        this.openResultModal(cashier.username)
        this.commonSrv.alert('success', 'account.update_status_agent_done', 'account.agent')
      },
      error: err => this.commonSrv.errorHandle(err, 'account.update_status_agent_failed', 'account.agent')
    });
  }

  openResultModal(code: string) {
      const resultModal = this.modalService.open(ActionResultModalComponent, {
        centered: true,
      });

      resultModal.componentInstance.message = 'account.update_status_agent_done';
      resultModal.componentInstance.isSuccess = true;

      resultModal.result.then(() => {
        const items = this.allItems;
        const index = items.findIndex(c => c.username === code);
        items[index] = { ...items[index], enabled: !items[index].enabled };
        this._allItems$.next(items);
        this.updatePaged();
      });
  }

}
