import {
  BehaviorSubject,
  Observable,
  finalize,
  startWith,
  distinctUntilChanged,
  debounceTime,
  combineLatest
} from 'rxjs';
import { Directive } from '@angular/core';
import {map} from "rxjs/operators";

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems?: number;
}

export interface ListQuery {
  [key: string]: any;
}

export interface ListResponse<T> {
  content: T[];
  totalElements: number;
}

@Directive()
export abstract class BaseListComponent<T> {

  protected _items$ = new BehaviorSubject<T[]>([]);
  protected _filterSubject$ = new BehaviorSubject<string>('');
  protected _loading$ = new BehaviorSubject<boolean>(false);
  protected _pagination$ = new BehaviorSubject<Pagination>({
    page: 1,
    pageSize: 10,
    totalItems: 0,
  });
  protected _query: ListQuery = {};

  pageSizeOptions = [5, 10, 25, 50];
  searchTerm: string = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' | '' = 'asc';

  items$: Observable<T[]>;
  loading$ = this._loading$.asObservable();
  pagination$ = this._pagination$.asObservable();

  protected constructor() {
    this.setupItems$();
  }

  abstract search(): void;
  abstract fetchData(query: ListQuery): Observable<ListResponse<T>>;

  load(): void {
    this._loading$.next(true);
    const params = {
      page: this.pagination.page,
      size: this.pagination.pageSize,
      ...this._query,
    };

    this.fetchData(params)
      .pipe(finalize(() => {this._loading$.next(false); }))
      .subscribe({
        next: (res) => {
          this._items$.next(res.content);
          this._pagination$.next({
            ...this.pagination,
            totalItems: res.totalElements,
          });
        },
      });
  }

  protected filterData(item: T[], filter: string): T[] { return item; }

  private setupItems$(): void {
    this.items$ = combineLatest([
      this._items$,
      this._filterSubject$.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          startWith('')
      )
    ]).pipe(
        map(([data, filter]) => this.filterData(data, filter))
    );
  }

  filterUpdate(event: any): void {
    const val = event?.target?.value ?? event ?? '';
    this._filterSubject$.next(val);
  }

  setPage(page: number) {
    this._pagination$.next({ ...this.pagination, page });
    this.load();
  }

  setPageSize(pageSize: number) {
    this._pagination$.next({ ...this.pagination, pageSize, page: 1 });
    this.load();
  }

  get pagination() {
    return this._pagination$.value;
  }

  get items() {
    return this._items$.value;
  }

}
