import {HttpClient} from "@angular/common/http";
import {Injectable, signal} from "@angular/core";
import { Router } from "@angular/router";
import {concatMap, tap} from "rxjs";
//
import {Authority, AuthResponse, Cashier, Credentials} from "../../shared/interfaces";
import { LocalStoreService } from "./local-store.service";
import {BaseApiService} from "./base-api.service";
import {Permission} from "../../shared/enums/permission";
import {KeyStore} from "../../shared/enums";

@Injectable({
  providedIn: "root"
})
export class AuthService extends BaseApiService {
  user: Cashier;
  authenticated = false;
  isBankUser: boolean = false;

  _permissions = signal<Permission[]>([]);

  constructor(
      private store: LocalStoreService,
      private router: Router,
      protected http: HttpClient
  ) {
    super(http)
    this.setUserAndPermission();
  }

  setUserAndPermission(user?: Cashier) {
    this.user = user || this.getUser();
    this.isBankUser = this.user && this.user?.role?.agent?.mode === 'BANK';
    this.authenticated = !!this.user;

    if (this.user && this.user.role) { this.setPermissions(this.user.role.authorities) }
  }

  getUser(): Cashier | null {
    return this.store.getItem(KeyStore.USER);
  }

  getAccessToken(): string {
    return this.store.getItem(KeyStore.ACCESS_TOKEN);
  }

  getLanguage(): string {
    return this.store.getItem(KeyStore.LANG);
  }

  signIn(credentials: Credentials) {
    return this.post<AuthResponse>('login', credentials).pipe(
      concatMap(res => {
        this.authenticated = true;
        this.setUserAndPermission(res.cashier);

        return this.store.setSecret(res.token).then(() => {
          this.store.setItem(KeyStore.USER, res.cashier);
          this.store.setItem(KeyStore.ACCESS_TOKEN, res.token);
        });
      })
    );
  }

  signOut() {
    return this.post<AuthResponse>('cashier/logout', {}).pipe(
      tap(() => this.signOutLocal())
    )
  }

  getUserData() {
    return this.get<Cashier>('cashier/info')
  }

  updatePassword(data: { username: string, secret: string, newSecret: string }) {
    return this.post<any>('cashier/updateSecret', data);
  }

  signOutLocal() {
      this.authenticated = false;
      this.store.clear();
      this.setPermissions([]);
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
