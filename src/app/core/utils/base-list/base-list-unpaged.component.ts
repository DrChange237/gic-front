import {Directive, OnInit} from "@angular/core";
import {
    BehaviorSubject,
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    finalize,
    Observable,
    startWith
} from "rxjs";
import {map} from "rxjs/operators";
import {Pagination} from "./base-list.component";

@Directive()
export abstract class BaseListNonPagedComponent<T> implements OnInit {

    protected _allItems$ = new BehaviorSubject<T[]>([]);
    protected _filterSubject$ = new BehaviorSubject<string>('');
    protected _loading$ = new BehaviorSubject<boolean>(false);
    protected _pagination$ = new BehaviorSubject<Pagination>({
        page: 1,
        pageSize: 100,
        totalItems: 0,
    });

    pageSizeOptions = [5, 10, 25, 50, 100];
    searchTerm: string = '';

    items$: Observable<T[]>;

    loading$ = this._loading$.asObservable();

    protected constructor() {
        this.setupItems$();
    }

    ngOnInit(): void {
        this.load();
    }

    abstract fetchData(): Observable<T[]>;

    load(): void {
        this._loading$.next(true);

        this.fetchData()
            .pipe(finalize(() => { this._loading$.next(false); }))
            .subscribe({
                next: (res) => {
                    this._allItems$.next(res);
                    this._pagination$.next({
                        ...this.pagination,
                        page: res.length ? 1 : 0,
                        totalItems: res.length,
                    });
                    this.updatePaged();
                },
            });
    }

    // item: T[], filter: string
    protected filterData(items: any, filter: any): T[] { return items; }

    filterUpdate(event: any): void {
        const val = event?.target?.value ?? event ?? '';
        this._filterSubject$.next(val);
        this._pagination$.next({ ...this.pagination, page: 1 });
    }

    setupItems$() {
        this.items$ = combineLatest([
            this._allItems$.pipe(),
            this._filterSubject$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                startWith('')
            ),
        ]).pipe(
            map(([allItems, filter]) => this.filterData(allItems, filter))
        );
    }

    updatePaged(): void {
        const { page, pageSize } = this.pagination;
        const startIndex = (page - 1) * pageSize;
        this._allItems$.next(this.allItems.slice(startIndex, startIndex + pageSize));
    }

    setPage(page: number): void {
        this._pagination$.next({ ...this.pagination, page });
        this.updatePaged();
    }

    setPageSize(pageSize: number): void {
        this._pagination$.next({ ...this.pagination, page: 1, pageSize });
        this.updatePaged();
    }

    get pagination() {
        return this._pagination$.value;
    }

    get allItems() {
        return this._allItems$.value;
    }
}
