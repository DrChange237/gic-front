import {HttpClient} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {tap} from "rxjs";
//
import {AuthResponse, Credentials} from "../../shared/interfaces";
import { LocalStoreService } from "./local-store.service";
import {BaseApiService} from "./base-api.service";

@Injectable({
  providedIn: "root"
})
export class AuthService extends BaseApiService {
  authenticated = false;

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

  getUser() {
    return this.store.getItem('user');
  }

  getAccessToken() {
    return this.store.getItem('access_token');
  }

  signIn(credentials: Credentials) {
    return this.post<AuthResponse>('login', credentials).pipe(
      tap(res => {
        this.authenticated = true;
        this.store.setItem('user', res.cashier);
        this.store.setItem('access_token', res.token);
      })
    );
  }

  signOut() {
    return this.post<AuthResponse>('cashier/logout', {}).pipe(
      tap(() => {
        this.authenticated = false;
        this.store.clear();
        this.router.navigateByUrl("/sessions/signin");
      })
    )
  }
}
