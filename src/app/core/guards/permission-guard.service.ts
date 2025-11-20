import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import { AuthService } from '../services/auth.service';
import {Permission} from "../../shared/enums/permission";

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard {

  constructor(
      private auth: AuthService,
      private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot) {
    const required = route.data['permissions'] as Permission[];

    if (!this.auth.hasPermissions(required)) return this.router.navigateByUrl('/others/404');

    return true;
  }
}
