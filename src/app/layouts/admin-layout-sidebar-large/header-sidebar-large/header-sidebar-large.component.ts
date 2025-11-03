import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
//
import { Language } from 'src/app/shared/enums';
import { INotifications } from 'src/app/shared/models';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { SearchService } from 'src/app/core/services/search.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
    selector: 'app-header-sidebar-large',
    templateUrl: './header-sidebar-large.component.html',
    styleUrls: ['./header-sidebar-large.component.scss'],
    standalone: false
})
export class HeaderSidebarLargeComponent implements OnInit {

    notifications: INotifications[] = [];
    languages: string[] = Object.values(Language);

    constructor(
      public navService: NavigationService,
      public searchService: SearchService,
      public translate: TranslateService,
      private auth: AuthService
    ) { }
  
    ngOnInit() {
    }
  
    toggelSidebar() {
      const state = this.navService.sidebarState;
      if (state.childnavOpen && state.sidenavOpen) {
        return state.childnavOpen = false;
      }
      if (!state.childnavOpen && state.sidenavOpen) {
        return state.sidenavOpen = false;
      }
      // item has child items
      if (!state.sidenavOpen && !state.childnavOpen 
        && this.navService.selectedItem.type === 'dropDown') {
          state.sidenavOpen = true;
          setTimeout(() => {
              state.childnavOpen = true;
          }, 50);
      }
      // item has no child items
      if (!state.sidenavOpen && !state.childnavOpen) {
        state.sidenavOpen = true;
      }
    }
  
    signout() {
      this.auth.signout();
    }

    changeLanguage(code: string) {
        this.translate.use(code);
        window.location.reload();
    }

}
