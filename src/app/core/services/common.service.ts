import { Injectable } from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {LocalStoreService} from "./local-store.service";
import {SecureDataService} from "./secure-data.service";
import {ToastOptions} from "../../shared/interfaces";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {CurrencyPipe, DatePipe, DecimalPipe, Location, TitleCasePipe} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
      public toastSrv: ToastrService,
      public translate: TranslateService,
      public store: LocalStoreService,
      public secureSrv: SecureDataService,
      public router: Router,
      public location: Location,
  ) {}

  openFileOnBlank(file: Blob | string, download: boolean = false, name?: string) {
    const url = typeof file === 'string'
        ? file
        : URL.createObjectURL(file);

    if (download) {
      window.open(url, '_blank');
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = name || 'file-' + +new Date();
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  errorHandle(err: any, message: string, title: string = 'toast.error', override?: Partial<ToastOptions>) {
    let messageTr = err?.error?.message || this.translate.instant(message);
    let titleTr = err?.error?.error || this.translate.instant(title);

    if (err instanceof HttpErrorResponse) {
      switch (err.status) {
        case 500:
          messageTr = this.translate.instant('toast.default_error');
          titleTr = this.translate.instant(title || 'toast.error');
          break;

        case 401:
          messageTr = this.translate.instant('sessions.session_expired');
          titleTr = this.translate.instant('toast.authentification_title');
          break;

        case 403:
          titleTr = this.translate.instant('toast.forbidden_title');
          messageTr = this.translate.instant('toast.forbidden_message');
      }
    }

    this.toastSrv.error(messageTr, titleTr, override);
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

  objectToDisplayList(obj: any, hiddenKeys: string[] = [], locale: string = 'fr-FR'): { key: string; label: string, value: string }[] {
    if (!obj || typeof obj !== 'object') return [];

    const datePipe = new DatePipe(locale);
    const currencyPipe = new CurrencyPipe(locale);
    const decimalPipe = new DecimalPipe(locale);
    const titleCasePipe = new TitleCasePipe();

    return Object.entries(obj)
        .filter(([key, _value]) => !hiddenKeys.includes(key))
        .map(([key, value]) => {
          let formattedValue: string;

          if (value === null || value === undefined || value === 'undefined') {
            formattedValue = 'N/A';
          } else if (typeof value === 'number' && ['amount'].includes(key)) {
            formattedValue = currencyPipe.transform(value, 'XAF') || 'N/A';
          } else if (typeof value === 'number') {
            formattedValue = decimalPipe.transform(value, '1.0-2') || value.toString();
          } else if (typeof value === 'boolean') {
            formattedValue = this.translate.instant('table.boolean.' + value);
          } else if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
            formattedValue = datePipe.transform(value, 'dd/MM/yyyy - HH:mm') || value;
          } else if (typeof value === 'object') {
            const sub = value['name'] || value['code'] || value['title'] || value['username'];
            formattedValue = sub ? sub.toString() : '[Objet]';
          } else {
            formattedValue = value.toString();
          }

          return {
            key: key,
            label: titleCasePipe.transform(key.replace(/([A-Z])/g, ' $1')), // ex: lastModifiedDate → Last Modified Date
            value: formattedValue
          };
        });
  }
}
