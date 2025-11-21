import {
  BehaviorSubject,
  Observable,
  finalize,
  startWith,
  distinctUntilChanged,
  debounceTime,
  combineLatest
} from 'rxjs';
import {Directive, OnInit} from '@angular/core';
import {map} from "rxjs/operators";
import {UntypedFormGroup} from "@angular/forms";

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
  protected _filterSubject$ = new BehaviorSubject<string>('');
  protected _loading$ = new BehaviorSubject<boolean>(false);
  protected _pagination$ = new BehaviorSubject<Pagination>({
    page: 1,
    pageSize: 10,
    totalItems: 0,
  });
  protected _query: ListQuery = {};
  filterForm: UntypedFormGroup = new UntypedFormGroup({});

  pageSizeOptions = [5, 10, 25, 50];
  searchTerm: string = '';

  loading$ = this._loading$.asObservable();

  items$: Observable<T[]>

  protected constructor() {
    this.setupItems$();
  }

  ngOnInit(): void {
    this.search();
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

  resetFilter() {
    this.filterForm.reset();
    this.search();
  }

  // item: T[], filter: string
  protected filterData(items: any, filter: any): T[] { return items; }

  filterUpdate(event: any): void {
    const val = event?.target?.value ?? event ?? '';
    this._filterSubject$.next(val);
  }

  setupItems$(){
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
