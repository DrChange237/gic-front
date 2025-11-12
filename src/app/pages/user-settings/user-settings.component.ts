import { Component, OnInit } from '@angular/core';
import {SharedComponentsModule} from "../../shared/components/shared-components.module";
import {CommonModule} from "@angular/common";
import {NgbNavModule} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../core/services/auth.service";
import {CommonService} from "../../core/services/common.service";
import {Cashier} from "../../shared/interfaces";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  imports: [CommonModule, SharedComponentsModule, NgbNavModule],
  standalone: true,
})
export class UserSettingsComponent implements OnInit {

  user: Cashier;

  constructor(
      private authSrv: AuthService,
      private commonSrv: CommonService,
  ) { }

  ngOnInit() {
    this.user = this.authSrv.getUser();
  }

}
