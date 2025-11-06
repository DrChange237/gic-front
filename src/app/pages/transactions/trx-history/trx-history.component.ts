import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import {Observable} from "rxjs";
import {NgbdSortableHeader, SortEvent} from "../../../shared/directives/sortable.directive";
import {Country} from "../../../shared/models";
import {NgbHighlight, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {AsyncPipe, DecimalPipe} from "@angular/common";
import {CountryService} from "../../../core/services/country.service";

@Component({
  selector: 'app-trx-history',
  templateUrl: './trx-history.component.html',
  styleUrls: ['./trx-history.component.scss'],
  imports: [SharedComponentsModule, NgbPagination, FormsModule, NgbHighlight, DecimalPipe, AsyncPipe],
  standalone: true,
  providers: [CountryService, DecimalPipe],
})
export class TrxHistoryComponent implements OnInit {
  countries$: Observable<Country[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: CountryService) {
    this.countries$ = service.countries$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

}
