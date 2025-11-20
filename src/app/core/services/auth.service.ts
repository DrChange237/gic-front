import {HttpClient} from "@angular/common/http";
import {Injectable, signal} from "@angular/core";
import { Router } from "@angular/router";
import {tap} from "rxjs";
//
import {Authority, AuthResponse, Cashier, Credentials} from "../../shared/interfaces";
import { LocalStoreService } from "./local-store.service";
import {BaseApiService} from "./base-api.service";
import {Permission} from "../../shared/enums/permission";

@Injectable({
  providedIn: "root"
})
export class AuthService extends BaseApiService {
  user: Cashier;
  authenticated = false;
  isBankUser: boolean = false;

  private _permissions = signal<Permission[]>([]);

  constructor(
      private store: LocalStoreService,
      private router: Router,
      protected http: HttpClient
  ) {
    super(http)
    this.checkAuth();
    this.setUserAndPermission();
  }

  checkAuth() {
    this.authenticated = !!this.getUser();
  }

  setUserAndPermission(user?: Cashier) {
    this.user = user ?? this.getUser();
    this.isBankUser = this.user && this.user?.role?.agent?.mode === 'BANK';

    if (this.user) { this.setPermissions(this.user.role.authorities) }
  }

  getUser(): Cashier | null {
    return this.store.getItem('user');
  }

  getAccessToken(): string {
    return this.store.getItem('access_token');
  }

  getLanguage(): string {
    return this.store.getItem('lang');
  }

  signIn(credentials: Credentials) {
    return this.post<AuthResponse>('login', credentials).pipe(
      tap(res => {
        this.authenticated = true;
        this.setUserAndPermission(res.cashier);
        this.store.setItem('user', res.cashier);
        this.store.setItem('access_token', res.token);
      })
    );
  }

  signOut() {
    return this.post<AuthResponse>('cashier/logout', {}).pipe(
      tap(() => this.signOutLocal())
    )
  }

  signOutLocal() {
      this.authenticated = false;
      this.store.clear();
      this.router.navigateByUrl("/sessions/signin");
  }

  setPermissions(perms: Authority[]) {
    this._permissions.set(perms.map(p => p.code));
  }

  hasPermission(permission: Permission): boolean {
    return this._permissions().includes(permission);
  }

  hasPermissions(required: Permission[]): boolean {
    if (!required || required.length === 0) return true;
    const userPerms = this._permissions();
    return required.every(p => userPerms.includes(p));
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    if (!permissions || permissions.length === 0) return true;
    const userPerms = this._permissions();
    return permissions.some(p => userPerms.includes(p));
  }
}
