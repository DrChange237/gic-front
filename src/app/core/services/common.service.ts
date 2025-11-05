import { Injectable } from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {LocalStoreService} from "./local-store.service";
import {SecureDataService} from "./secure-data.service";
import {ToastOptions} from "../../shared/interfaces";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
      public toastSrv: ToastrService,
      public translate: TranslateService,
      public store: LocalStoreService,
      public secureSrv: SecureDataService,
  ) {}

  errorHandle(err: any, message: string, title: string = 'toast.error', override?: Partial<ToastOptions>) {
    this.toastSrv.error(
        err?.error?.error_description || this.translate.instant(message),
        err?.error?.error || this.translate.instant(title),
        override
    )
  }

  alert(toast: string, message: string, title?: string, override: Partial<ToastOptions> = { closeButton: true }) {
    const data = {
      message: this.translate.instant(message),
      title: this.translate.instant(title || `toast.${toast}`),
    };

    switch (toast) {
      case 'info': this.toastSrv.info(data.message, data.title, override); break;
      case 'error': this.toastSrv.error(data.message, data.title, override); break;
      case 'success': this.toastSrv.success(data.message, data.title, override); break;
      case 'warning': this.toastSrv.warning(data.message, data.title, override); break;
    }
  }

  toggleLanguage(lang: string) {
    this.store.setItem('lang', lang);
    this.translate.use(lang);
  }
}
