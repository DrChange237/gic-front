import {Component} from '@angular/core';
import {CommonService} from "./core/services/common.service";
import {Language} from "./shared/enums";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

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
      private modalService: NgbModal,
  ) {
      modalService.dismissAll();
      this.setLanguage();
  }

  setLanguage() {
      const lang = this.commonSrv.store.getItem('lang');
      (Object.values(Language).includes(lang)) && this.commonSrv.toggleLanguage(lang);
  }

}
