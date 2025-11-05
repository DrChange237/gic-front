import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Breadcrumb, BreadcrumbService} from "../../../core/services/breadcrumb.service";

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    standalone: false
})
export class BreadcrumbComponent {

    breadcrumbs$!: Observable<Breadcrumb[]>;

    constructor(private breadcrumbService: BreadcrumbService) {
        this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
    }

}
