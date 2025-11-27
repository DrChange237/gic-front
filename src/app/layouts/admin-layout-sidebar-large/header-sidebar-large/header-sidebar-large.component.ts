import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
//
import { Language } from 'src/app/shared/enums';
import { INotifications } from 'src/app/shared/models';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { AuthService } from 'src/app/core/services/auth.service';
import {CommonService} from "../../../core/services/common.service";
import {Cashier} from "../../../shared/interfaces";
import {AccountService} from "../../../core/services/account.service";
import {Permission} from "../../../shared/enums/permission";

@Component({
    selector: 'app-header-sidebar-large',
    templateUrl: './header-sidebar-large.component.html',
    styleUrls: ['./header-sidebar-large.component.scss'],
    standalone: false
})
export class HeaderSidebarLargeComponent implements OnInit {

    user: Cashier;
    notifications: INotifications[] = [];

    protected languages: string[] = Object.values(Language);
    protected readonly Permission = Permission;

    constructor(
      public navService: NavigationService,
      public translate: TranslateService,
      public accountSrv: AccountService,
      public authSrv: AuthService,
      private commonSrv: CommonService,
    ) { }
  
    ngOnInit() {
      this.user = this.authSrv.user;
      if (this.authSrv.authenticated && !this.authSrv.isBankUser) this.getAccount();
    }
  
    toggleSidebar() {
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
  
    signOut() {
      this.authSrv.signOut().subscribe({
        next: () => this.commonSrv.alert('info', 'sessions.sign_out_success', 'sessions.session'),
        error: () => this.commonSrv.alert('error', 'sessions.sign_out_failed', 'sessions.session')
      });
    }

    changeLanguage(code: string) {
        this.commonSrv.toggleLanguage(code);
        window.location.reload();
    }

    getAccount() {
        this.accountSrv.getAccountOperation().subscribe({
            error: _err => {}
        });
    }
}
