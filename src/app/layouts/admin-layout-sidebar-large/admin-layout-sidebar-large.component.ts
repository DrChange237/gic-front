import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { SearchService } from 'src/app/core/services/search.service';

@Component({
    selector: 'app-admin-layout-sidebar-large',
    templateUrl: './admin-layout-sidebar-large.component.html',
    styleUrls: ['./admin-layout-sidebar-large.component.scss'],
    standalone: false
})
export class AdminLayoutSidebarLargeComponent implements OnInit {

    moduleLoading: boolean;
  
    constructor(
      public navService: NavigationService,
      public searchService: SearchService,
      private router: Router
    ) { }
  
    ngOnInit() {
      this.router.events.subscribe(event => {
        if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
          this.moduleLoading = true;
        }
        if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
          this.moduleLoading = false;
        }
      });
    }

}
