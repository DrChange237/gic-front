import { Component, OnInit } from '@angular/core';
import {NgbHighlight, NgbModal, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectComponent} from "@ng-select/ng-select";
import {TranslatePipe} from "@ngx-translate/core";
import {catchError, Observable, of} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {CommonModule} from "@angular/common";
//
import {SharedComponentsModule} from "../../../shared/components/shared-components.module";
import {CommonService} from "../../../core/services/common.service";
import {AuthService} from "../../../core/services/auth.service";
import {BaseListNonPagedComponent} from "../../../core/utils/base-list/base-list-unpaged.component";
import {OperationAccount} from "../../../shared/interfaces";
import {HasPermissionDirective} from "../../../shared/directives/permission.directive";
import {SharedPipesModule} from "../../../shared/pipes/shared-pipes.module";
import {
  ConfirmActionModalComponent
} from "../../../shared/components/confirm-action-modal/confirm-action-modal.component";
import {ActionResultModalComponent} from "../../../shared/components/action-result-modal/action-result-modal.component";
import {AccountService} from "../../../core/services/account.service";
import {Permission} from "../../../shared/enums/permission";

@Component({
  selector: 'app-mgn-operation-review',
  templateUrl: './mgn-operation-review.component.html',
  styleUrls: ['./mgn-operation-review.component.scss'],
  imports: [CommonModule, SharedComponentsModule, HasPermissionDirective, NgSelectComponent, NgbHighlight, NgbPagination, ReactiveFormsModule, TranslatePipe, FormsModule, SharedPipesModule],
  standalone: true
})
export class MgnOperationReviewComponent extends BaseListNonPagedComponent<OperationAccount> implements OnInit {

  paramsFilter: { id: string, name: string, availability: string } | null = null;

  constructor(
      private modalService: NgbModal,
      private route: ActivatedRoute,
      private commonSrv: CommonService,
      private accountSrv: AccountService,
      private authSrv: AuthService,
  ) {
    super();
    this.initParams();
  }

  initParams() {
    const param = this.route.snapshot.paramMap.get('data');
    if (param) this.paramsFilter = this.commonSrv.secureSrv.decryptParams(param);
  }

  fetchData(): Observable<OperationAccount[]> {
    const agencyId = this.paramsFilter?.id || this.authSrv.user?.agency?.id;

    return this.accountSrv.getOperationAccount(agencyId).pipe(
      catchError(err => {
        this.commonSrv.errorHandle(err, 'account.get_account_review_list_failed', 'account.operation_review');
        return of(null);
      })
    );
  }

  filterData(items: OperationAccount[], filter: string): OperationAccount[] {
    const lowerTerm = filter.toLowerCase();
    return items?.filter(account =>
        account.biller.name?.toLowerCase()?.includes(lowerTerm) ||
        account.account.accountNumber?.toLowerCase()?.includes(lowerTerm)
    );
  }

  openConfirmModal() {
    const modalRef = this.modalService.open(ConfirmActionModalComponent, {
      centered: true, backdrop: 'static',
    });

    modalRef.componentInstance.title = 'modal.confirm_availability_agency';
    modalRef.componentInstance.message = this.paramsFilter?.availability === 'OPEN'
        ? 'modal.confirm_close_agency'
        : 'modal.confirm_open_agency';
    modalRef.componentInstance.requirePin = false;

    modalRef.result.then((res: string) => res && this.updateAvailability(res));
  }

  updateAvailability(code: string) {
    const data = {
      agencyId: this.paramsFilter.id,
      avaibility: this.paramsFilter.availability === 'OPEN' ? 'CLOSED' : 'OPEN',
      password: code
    };

    this.accountSrv.updateAgencyAvailability(data).subscribe({
      next: () => {
        const resultModal = this.modalService.open(ActionResultModalComponent, {
          centered: true, backdrop: 'static',
        });

        resultModal.componentInstance.isSuccess = true;

        resultModal.result.then(() => { this.commonSrv.router.navigateByUrl('management/agencies') });
      },
      error: err => this.commonSrv.errorHandle(err,  'account.update_availability_agency_failed', 'account.agency')
    });
  }

  protected readonly Permission = Permission;
}
