import {Component, Input} from '@angular/core';
import {Observable} from "rxjs";
import {Breadcrumb, BreadcrumbService} from "../../../core/services/breadcrumb.service";
import {CommonService} from "../../../core/services/common.service";

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    standalone: false
})
export class BreadcrumbComponent {
    @Input() subName: string = '';
    breadcrumbs$!: Observable<Breadcrumb[]>;

    constructor(
        private breadcrumbService: BreadcrumbService,
        private commonSrv: CommonService,
    ) {
        this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
    }

    back() {
        this.commonSrv.location.back();
    }
}
