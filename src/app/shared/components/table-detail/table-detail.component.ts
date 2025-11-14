import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CommonModule} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {TranslatePipe} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-table-detail',
  templateUrl: './table-detail.component.html',
  styleUrls: ['./table-detail.component.scss'],
  imports: [CommonModule, NgSelectModule, TranslatePipe, NgbPagination, FormsModule],
  standalone: true,
})
export class TableDetailComponent implements OnChanges {

  @Input() data: { key: string; label: string; value: string }[] = [];
  @Input() pageSize: number = 5;
  @Input() paginate: boolean = false;
  @Input() columns: string[] = ['label', 'value'];

  currentPage = 1;
  pagedData: { key: string; label: string; value: string }[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['pageSize'] || changes['paginate']) {
      this.updatePagedData();
    }
  }

  updatePagedData(): void {
    if (!this.paginate) {
      this.pagedData = this.data;
      return;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedData = this.data?.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagedData();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.updatePagedData();
  }

  get totalItems(): number {
    return this.data?.length || 0;
  }

}
