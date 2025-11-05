import type {HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Injectable} from "@angular/core";
import {HttpHandler, HttpRequest} from "@angular/common/http";
import {finalize, Observable} from "rxjs";
import {AuthService} from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private whiteList: { url: string; method: string }[] = [
    { url: '/login', method: 'POST' },
    { url: '/public', method: 'GET' }
  ];

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.authService.getAccessToken();
    const isWhitelisted = this.whiteList.some(item =>
        req.url.includes(item.url) && req.method.toUpperCase() === item.method.toUpperCase()
    );

    let clonedRequest = req;

    if (token && !isWhitelisted) {
      clonedRequest = req.clone({
        setHeaders: { Authorization: `${token}` }
      });
    }

    return next.handle(clonedRequest);
  }
}
