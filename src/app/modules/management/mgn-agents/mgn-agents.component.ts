import {Component, OnInit, TemplateRef} from '@angular/core';
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
import {Cashier, Role} from "../../../shared/interfaces";
import {BaseListNonPagedComponent} from "../../../core/utils/base-list/base-list-unpaged.component";
import {SharedPipesModule} from "../../../shared/pipes/shared-pipes.module";
import {
  ConfirmActionModalComponent
} from "../../../shared/components/confirm-action-modal/confirm-action-modal.component";
import {ActionResultModalComponent} from "../../../shared/components/action-result-modal/action-result-modal.component";
import {ActivatedRoute} from "@angular/router";
import {Permission} from "../../../shared/enums/permission";
import {HasPermissionDirective} from "../../../shared/directives/permission.directive";
import {SecureDataService} from "../../../core/services/secure-data.service";

@Component({
  selector: 'app-mgn-agents',
  templateUrl: './mgn-agents.component.html',
  styleUrls: ['./mgn-agents.component.scss'],
  imports: [CommonModule, SharedPipesModule, SharedComponentsModule, FormsModule, NgSelectComponent, NgbHighlight,
    NgbPagination, ReactiveFormsModule, TranslatePipe, NgbTooltip, HasPermissionDirective],
  standalone: true
})
export class MgnAgentsComponent extends BaseListNonPagedComponent<Cashier> implements OnInit {

  roles: Role[];
  cashierRole: Role;
  currCashier: Cashier;
  errorMessage: string;

  listType: string = '';

  protected readonly Permission = Permission;

  constructor(
      private modalService: NgbModal,
      private commonSrv: CommonService,
      private accountSrv: AccountService,
      private route: ActivatedRoute,
      private secureSrv: SecureDataService,
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
    const param = this.secureSrv.encryptParams({id: cashier.id, name: cashier.name});
    this.commonSrv.router.navigate(['transactions/history/agent', param])
  }

  editRoleCashier(content: TemplateRef<never>, cashier: Cashier) {
    this.accountSrv.getListRoles().subscribe({
      next: res => {
        this.roles = res;
        this.cashierRole = cashier.role;
        this.currCashier = cashier;
        this.errorMessage = '';
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
      },
      error: err => this.commonSrv.errorHandle(err, 'account.get_agent_list_failed', 'account.role')
    });
  }

  openConfirmModal(update: 'ROLE' | 'STATUS', cashier?: Cashier) {
    if (update === 'ROLE' && this.currCashier.role.id === this.cashierRole.id) {
      this.errorMessage = 'form.select_role_already_apply';
      return;
    } else { this.modalService.dismissAll() }

    const modalRef = this.modalService.open(ConfirmActionModalComponent, {
      centered: true, backdrop: 'static',
    });

    if (update === "STATUS") {
      this.currCashier = cashier;
      modalRef.componentInstance.title = cashier.enabled ? 'modal.disable' : 'modal.enable';
      modalRef.componentInstance.message = this.commonSrv.translate.instant(
          cashier.enabled ? 'modal.disable_message' : 'modal.enable_message',
          { name: cashier.name });
      modalRef.componentInstance.withoutAuth = true;
      modalRef.result.then((res: string) => res && this.onChangeStatusAgent());
    }

    if (update === "ROLE") {
      modalRef.componentInstance.withoutAuth = false;
      modalRef.componentInstance.requirePin = false;
      modalRef.result.then((res: string) => res && this.onChangeRoleAgent(res));
    }
  }

  onChangeStatusAgent() {
    this.accountSrv.updateCashierStatus(this.currCashier.username, !this.currCashier.enabled).subscribe({
      next: () => { this.openResultModal('STATUS') },
      error: err => this.commonSrv.errorHandle(err, 'account.update_status_agent_failed', 'account.agent')
    });
  }

  onChangeRoleAgent(code: string) {
    const data = { cashierId: this.currCashier.id, roleId: this.cashierRole.id, password: code };

    this.accountSrv.updateCashierRole(data).subscribe({
      next: () => { this.openResultModal('ROLE'); },
      error: err => this.commonSrv.errorHandle(err, 'account.update_role_agent_failed', 'account.agent')
    });
  }

  openResultModal(action: 'ROLE' | 'STATUS') {
      const resultModal = this.modalService.open(ActionResultModalComponent, { centered: true });

      resultModal.componentInstance.message = action === 'STATUS' ? 'account.update_status_agent_done' : 'account.update_role_agent_done';
      resultModal.componentInstance.isSuccess = true;

      resultModal.result.then(() => {
        const items = this.allItems;
        const index = items.findIndex(c => c.username === this.currCashier.username);

        if (action === 'STATUS') { items[index] = { ...items[index], enabled: !this.currCashier.enabled }; }
        if (action === 'ROLE') { items[index] = { ...items[index], role: this.cashierRole }; }
        this.cashierRole = null;
        this.currCashier = null;

        this._allItems$.next(items);
        this.updatePaged();
      });
  }

}
