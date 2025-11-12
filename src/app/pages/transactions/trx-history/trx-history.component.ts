import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {NgbHighlight, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {AsyncPipe, CurrencyPipe, DatePipe} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslatePipe} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
//
import {BaseListComponent, ListQuery} from "../../../core/utils/base-list/base-list.component";
import {FactoryService} from "../../../core/services/factory.service";
import {Transaction} from "../../../shared/interfaces";
import {SharedPipesModule} from "../../../shared/pipes/shared-pipes.module";
import {CommonService} from "../../../core/services/common.service";
import {ActivatedRoute} from "@angular/router";
import {SharedComponentsModule} from "../../../shared/components/shared-components.module";

@Component({
  selector: 'app-trx-history',
  templateUrl: './trx-history.component.html',
  styleUrls: ['./trx-history.component.scss'],
  imports: [NgbPagination, FormsModule, NgbHighlight, AsyncPipe, NgSelectModule,
    TranslatePipe, DatePipe, CurrencyPipe, SharedPipesModule, SharedComponentsModule],
  standalone: true,
})
export class TrxHistoryComponent extends BaseListComponent<Transaction> implements OnInit {
  historyType: string = '';

  constructor(
      private route: ActivatedRoute,
      private commonSrv: CommonService,
      private factorySrv: FactoryService,
  ) {
    super();
    this.historyType = this.route.snapshot.data['history'];
  }

  ngOnInit(): void {
    this.search();
  }

  override search() { this.load(); }

  override fetchData(query: ListQuery) {
    return this.factorySrv.getTrxHistory(query, this.historyType);
  }

  protected override filterData(items: Transaction[], filter: string): Transaction[] {
    const lowerTerm = filter.toLowerCase();
    return items.filter(user =>
        user.serviceName.toLowerCase().includes(lowerTerm) ||
        user.reference.toLowerCase().includes(lowerTerm)
    );
  }

}
