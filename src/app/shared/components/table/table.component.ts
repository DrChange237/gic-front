import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgbHighlight, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {TranslatePipe} from "@ngx-translate/core";

export interface TableColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [CommonModule, NgSelectModule, NgbHighlight, TranslatePipe, NgbPagination],
  standalone: true
})
export class TableComponent<T> {

  @Input() data: T[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() pageSize = 10;
  @Input() total = 0;
  @Input() pageIndex = 0;

  @Output() pageChange = new EventEmitter<number>();
  @Output() sizeChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<{ column: string, direction: 'asc' | 'desc' }>();
  @Output() rowClick = new EventEmitter<T>();

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  onSizeChange(page: number) {
    this.sizeChange.emit(page);
  }

  onSort(column: string, direction: 'asc' | 'desc') {
    this.sortChange.emit({ column, direction });
  }

  onRowClick(row: T) {
    this.rowClick.emit(row);
  }

}
