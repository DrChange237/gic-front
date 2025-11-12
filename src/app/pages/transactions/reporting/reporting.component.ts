import { Component, OnInit } from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder} from "@angular/forms";
import {AsyncPipe, CurrencyPipe, DatePipe, formatDate, NgClass, UpperCasePipe} from "@angular/common";
import {catchError, of} from "rxjs";
//
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import {BaseListComponent, ListQuery} from "../../../core/utils/base-list/base-list.component";
import {ReportingService} from "../../../core/services/reporting.service";
import {CommonService} from "../../../core/services/common.service";
import {Report} from "../../../shared/interfaces";
import {NgSelectComponent} from "@ng-select/ng-select";
import {NgbHighlight, NgbInputDatepicker, NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {SharedPipesModule} from "../../../shared/pipes/shared-pipes.module";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss'],
  imports: [SharedComponentsModule, AsyncPipe, CurrencyPipe, DatePipe, FormsModule, NgSelectComponent, NgbHighlight, NgbInputDatepicker, NgbPagination, ReactiveFormsModule, SharedPipesModule, TranslatePipe, UpperCasePipe, NgbTooltip, NgClass],
  standalone: true,
})
export class ReportingComponent extends BaseListComponent<Report> implements OnInit {
  filterForm: FormGroup;

  constructor(
      private fb: UntypedFormBuilder,
      private commonSrv: CommonService,
      private reportingSrv: ReportingService,
  ) {
    super();
    this.initializeForm()
  }

  initializeForm() {
    this.filterForm = this.fb.group({
      search: [''],
      startDate: [null],
      endDate: [null]
    });
  }

  override search() {
    this._query = this.filterForm.getRawValue();
    this.load();
  }

  override fetchData(query: ListQuery) {
    return this.reportingSrv.getReporting(query).pipe(
      catchError(err => {
        this.commonSrv.errorHandle(err, 'reporting.get_history_report_failed', 'reporting.report');
        return of(null);
      })
    );
  }

  protected override filterData(items: Report[], filter: string): Report[] {
    const lowerTerm = filter.toLowerCase();
    return items.filter(report =>
        report.name.toLowerCase().includes(lowerTerm) ||
        report.description.toLowerCase().includes(lowerTerm)
    );
  }

  downloadReport(report: Report) {
    this.reportingSrv.downloadReport(report.id).subscribe({
      next: res => {
        const name = report.name + '-' + formatDate(new Date(), 'yyyy-MM-dd_HH-mm', 'fr-FR');
        this.commonSrv.openFileOnBlank(res, true, `'cca-receipt-${name}.pdf`)
      },
      error: err => this.commonSrv.errorHandle(err, 'reporting.download_report_failed', 'reporting.report')
    });
  }

}
