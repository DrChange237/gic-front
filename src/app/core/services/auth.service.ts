import {HttpClient} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {tap} from "rxjs";
//
import {AuthResponse, Cashier, Credentials} from "../../shared/interfaces";
import { LocalStoreService } from "./local-store.service";
import {BaseApiService} from "./base-api.service";

@Injectable({
  providedIn: "root"
})
export class AuthService extends BaseApiService {
  authenticated = false;
  isBankUser: boolean = false;

  constructor(
      private store: LocalStoreService,
      private router: Router,
      protected http: HttpClient
  ) {
    super(http)
    this.checkAuth();
  }

  checkAuth() {
    this.authenticated = this.store.getItem("user");
  }

  checkBankUser(user?: Cashier) {
    user = user ?? this.store.getItem("user");
    this.isBankUser = user && user?.role?.agent?.mode === 'BANK';
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
        this.checkBankUser(res.cashier);
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
}
