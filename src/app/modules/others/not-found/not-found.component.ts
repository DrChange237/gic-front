import { Component, OnInit } from '@angular/core';
import {Permission} from "../../../shared/enums/permission";
import {AuthService} from "../../../core/services/auth.service";

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss'],
    standalone: false
})
export class NotFoundComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  getUrlRedirect() {
      return !this.auth.hasPermission(Permission.DASHBOARD_VIEW) ? '/dashboard' : '/transactions';
  }

}
