import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {NgbHighlight, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {AsyncPipe, CurrencyPipe, DatePipe} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslatePipe} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
//
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import {NgbdSortableHeader, SortEvent} from "../../../shared/directives/sortable.directive";
import {BaseListComponent, ListQuery} from "../../../core/utils/base-list/base-list.component";
import {FactoryService} from "../../../core/services/factory.service";
import {Transaction} from "../../../shared/interfaces";
import {SharedPipesModule} from "../../../shared/pipes/shared-pipes.module";

@Component({
  selector: 'app-trx-history',
  templateUrl: './trx-history.component.html',
  styleUrls: ['./trx-history.component.scss'],
  imports: [SharedComponentsModule, NgbPagination, FormsModule, NgbHighlight, AsyncPipe, NgbdSortableHeader, NgSelectModule,
    TranslatePipe, DatePipe, CurrencyPipe, SharedPipesModule],
  standalone: true,
})
export class TrxHistoryComponent extends BaseListComponent<Transaction> implements OnInit {
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
      private factorySrv: FactoryService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.load();
  }

  override fetchData(query: ListQuery) {
    return this.factorySrv.getTrxHistory(query);
  }

  onSort({ column, direction }: SortEvent) {
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.sortColumn = column;
    this.sortDirection = direction;
  }

}
