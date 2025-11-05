import {Component, OnInit} from '@angular/core';
import {CommonService} from "./core/services/common.service";
import {Language} from "./shared/enums";
import {AccountService} from "./core/services/account.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  title = 'bootDash';

  constructor(
      private accountSrv: AccountService,
      private commonSrv: CommonService,
  ) {
      this.setLanguage();
      this.getAccount();
  }

  getAccount() {
      this.accountSrv.getAccountOperation().subscribe();
  }

  setLanguage() {
      const lang = this.commonSrv.store.getItem('lang');
      (Object.values(Language).includes(lang)) && this.commonSrv.toggleLanguage(lang);
  }

}
