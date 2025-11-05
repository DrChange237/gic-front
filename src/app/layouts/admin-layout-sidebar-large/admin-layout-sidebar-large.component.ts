import { Component, OnInit } from '@angular/core';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { NavigationService } from 'src/app/core/services/navigation.service';
import {LoaderService} from "../../core/services/loader.service";

@Component({
    selector: 'app-admin-layout-sidebar-large',
    templateUrl: './admin-layout-sidebar-large.component.html',
    styleUrls: ['./admin-layout-sidebar-large.component.scss'],
    standalone: false
})
export class AdminLayoutSidebarLargeComponent implements OnInit {

    moduleLoading: boolean;
    private routeLoading = false;
    private httpLoading = false;
  
    constructor(
      public navService: NavigationService,
      private loaderService: LoaderService,
      private router: Router
    ) { }

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
                this.routeLoading = true;
            } else if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
                this.routeLoading = false;
            }
            this.updateLoadingState();
        });

        this.loaderService.loading$.subscribe(loading => {
            this.httpLoading = loading;
            this.updateLoadingState();
        });
    }

    private updateLoadingState() {
        this.moduleLoading = this.routeLoading || this.httpLoading;
    }
}
