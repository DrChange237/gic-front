import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { Directive, OnInit } from '@angular/core';

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
export abstract class BaseListComponent<T> implements OnInit {

  protected _items$ = new BehaviorSubject<T[]>([]);
  protected _loading$ = new BehaviorSubject<boolean>(false);
  protected _pagination$ = new BehaviorSubject<Pagination>({
    page: 1,
    pageSize: 10,
    totalItems: 0,
  });
  protected _query: ListQuery = {};

  items$ = this._items$.asObservable();
  loading$ = this._loading$.asObservable();
  pagination$ = this._pagination$.asObservable();

  abstract fetchData(query: ListQuery): Observable<ListResponse<T>>;

  ngOnInit() {
    this.load();
  }

  load(): void {
    this._loading$.next(true);
    const params = {
      page: this.pagination.page,
      pageSize: this.pagination.pageSize,
      ...this._query,
    };

    this.fetchData(params)
      .pipe(finalize(() => this._loading$.next(false)))
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
