import {Component, OnInit} from '@angular/core';
import {NgbModal, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CommonModule, formatDate} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslatePipe} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {catchError, of} from "rxjs";
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder} from "@angular/forms";
//
import {BaseListComponent, ListQuery} from "../../../core/utils/base-list/base-list.component";
import {SharedComponentsModule} from "../../../shared/components/shared-components.module";
import {SharedPipesModule} from "../../../shared/pipes/shared-pipes.module";
import {FactoryService} from "../../../core/services/factory.service";
import {CommonService} from "../../../core/services/common.service";
import {Transaction} from "../../../shared/interfaces";
import {TableDetailComponent} from "../../../shared/components/table-detail/table-detail.component";
import {Permission} from "../../../shared/enums/permission";
import {HasPermissionDirective} from "../../../shared/directives/permission.directive";
import {SecureDataService} from "../../../core/services/secure-data.service";
import {TrxDetailModalComponent} from "../trx-detail-modal/trx-detail-modal.component";

@Component({
  selector: 'app-trx-history',
  templateUrl: './trx-history.component.html',
  styleUrls: ['./trx-history.component.scss'],
  imports: [CommonModule, SharedPipesModule, SharedComponentsModule, FormsModule, NgbModule, NgSelectModule,
    TranslatePipe, TableDetailComponent, ReactiveFormsModule, HasPermissionDirective],
  standalone: true,
})
export class TrxHistoryComponent extends BaseListComponent<Transaction> implements OnInit {

  paramsFilter: { id: string, name: string } | null = null;
  historyType: string = '';

  protected readonly Permission = Permission;

  constructor(
      private fb: UntypedFormBuilder,
      private modalService: NgbModal,
      private route: ActivatedRoute,
      private commonSrv: CommonService,
      private factorySrv: FactoryService,
      private secureSrv: SecureDataService,
  ) {
    super();
    this.initializeForm();
    this.historyType = this.route.snapshot.data['history'];
  }

  initializeForm() {
    this.filterForm = this.fb.group({
      reference: [''],
      startDate: [null],
      endDate: [null]
    });

    const param = this.route.snapshot.paramMap.get('data');
    if (param) this.paramsFilter = this.secureSrv.decryptParams(param);
  }

  override search() {
    this._query = this.filterForm.getRawValue();
    if (this.paramsFilter) {
      const entity = this.historyType ? 'agencyId' : 'cashierId';
      this._query[entity] = this.paramsFilter.id;
    }
    this.load();
  }

  override fetchData(query: ListQuery) {
    return this.factorySrv.getTrxHistory(query, this.historyType, this.paramsFilter?.id).pipe(
      catchError(err => {
        err && this.commonSrv.errorHandle(err, 'transactions.get_history_transaction_failed', 'transactions.history');
        return of(null);
      })
    );
  }

  protected override filterData(items: Transaction[], filter: string): Transaction[] {
    const lowerTerm = filter.toLowerCase();
    return items.filter(transaction =>
        transaction.serviceName?.toLowerCase()?.includes(lowerTerm) ||
        transaction.reference?.toLowerCase()?.includes(lowerTerm) ||
        transaction.receiptId?.toLowerCase()?.includes(lowerTerm) ||
        transaction.cashier?.name.toLowerCase()?.includes(lowerTerm) ||
        transaction.cashier?.agency?.name?.toLowerCase()?.includes(lowerTerm) ||
        transaction.amount?.toString()?.includes(lowerTerm)
    );
  }

  downloadReceipt(transaction: Transaction) {
    this.factorySrv.downloadReceipt(transaction.transactionId).subscribe({
      next: res => {
        const name = transaction.serviceName + '-' + formatDate(new Date(), 'yyyy-MM-dd_HH-mm', 'fr-FR');
        this.commonSrv.openFileOnBlank(res, true, `'cca-receipt-${name}.pdf`)
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.download_receipt_payment_failed', 'transactions.history')
    });
  }

  openDetailTrx(transaction: Transaction) {
    if (!transaction) return;
    this.factorySrv.getTrxDetail(transaction.id).subscribe({
      next: res => {
        const modalRef = this.modalService.open(
            TrxDetailModalComponent, { size: "lg", ariaLabelledBy: 'modal-basic-title', centered: true }
        );
        modalRef.componentInstance.transaction = res;
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.get_detail_transaction_failed', 'transactions.history')
    });
  }
}
