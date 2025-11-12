import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbHighlight, NgbInputDatepicker, NgbModal, NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {AsyncPipe, CurrencyPipe, DatePipe, formatDate, UpperCasePipe} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslatePipe} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {NgScrollbar} from "ngx-scrollbar";
import {catchError, of} from "rxjs";
import {FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder} from "@angular/forms";
//
import {BaseListComponent, ListQuery} from "../../../core/utils/base-list/base-list.component";
import {SharedComponentsModule} from "../../../shared/components/shared-components.module";
import {SharedPipesModule} from "../../../shared/pipes/shared-pipes.module";
import {FactoryService} from "../../../core/services/factory.service";
import {CommonService} from "../../../core/services/common.service";
import {Transaction} from "../../../shared/interfaces";
import {TableDetailComponent} from "../../../shared/components/table-detail/table-detail.component";

@Component({
  selector: 'app-trx-history',
  templateUrl: './trx-history.component.html',
  styleUrls: ['./trx-history.component.scss'],
  imports: [SharedPipesModule, SharedComponentsModule, NgbPagination, FormsModule, NgbHighlight, AsyncPipe, NgSelectModule,
    TranslatePipe, DatePipe, CurrencyPipe, UpperCasePipe, NgbTooltip, TableDetailComponent, NgScrollbar, NgbInputDatepicker, ReactiveFormsModule],
  standalone: true,
})
export class TrxHistoryComponent extends BaseListComponent<Transaction> implements OnInit {

  historyType: string = '';

  currTransaction: Transaction;
  datasTransaction: { key: string; label: string, value: string }[];

  @ViewChild(NgScrollbar) scrollbarRef!: NgScrollbar;

  constructor(
      private fb: UntypedFormBuilder,
      private modalService: NgbModal,
      private route: ActivatedRoute,
      private commonSrv: CommonService,
      private factorySrv: FactoryService,
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
  }

  override search() {
    this._query = this.filterForm.getRawValue();
    this.load();
  }

  override fetchData(query: ListQuery) {
    return this.factorySrv.getTrxHistory(query, this.historyType).pipe(
      catchError(err => {
        this.commonSrv.errorHandle(err, 'transactions.get_history_transaction_failed', 'transactions.history');
        return of(null);
      })
    );
  }

  protected override filterData(items: Transaction[], filter: string): Transaction[] {
    const lowerTerm = filter.toLowerCase();
    return items.filter(transaction =>
        transaction.serviceName.toLowerCase().includes(lowerTerm) ||
        transaction.reference.toLowerCase().includes(lowerTerm)
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

  openDetailTrx(content: TemplateRef<never>, transaction: Transaction) {
    if (!transaction) return;
    this.factorySrv.getTrxDetail(transaction.id).subscribe({
      next: res => {
        this.currTransaction = res
        this.datasTransaction = this.commonSrv.objectToDisplayList(res, ['id', 'choice', 'serviceLogo']);
        this.modalService
            .open(content, { size: "lg", ariaLabelledBy: 'modal-basic-title', centered: true })
            .shown.subscribe(() => { this.scrollbarRef?.scrollTo({top: 0}).then();  });
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.get_detail_transaction_failed', 'transactions.history')
    });
  }
}
