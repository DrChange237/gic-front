import type {HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Injectable} from "@angular/core";
import {LoaderService} from "../services/loader.service";
import {HttpHandler, HttpRequest} from "@angular/common/http";
import {finalize, Observable} from "rxjs";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show();

    return next.handle(req).pipe(
        finalize(() => { this.loaderService.hide(); })
    );
  }
}
