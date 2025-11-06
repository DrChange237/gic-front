import {Component} from '@angular/core';
import {CommonService} from "./core/services/common.service";
import {Language} from "./shared/enums";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  title = 'bootDash';

  constructor(
      private commonSrv: CommonService,
  ) {
      this.setLanguage();
  }

  setLanguage() {
      const lang = this.commonSrv.store.getItem('lang');
      (Object.values(Language).includes(lang)) && this.commonSrv.toggleLanguage(lang);
  }

}
