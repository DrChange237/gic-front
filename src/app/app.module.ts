import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient} from '@angular/common/http';
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import {provideTranslateService} from "@ngx-translate/core";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {registerLocaleData} from "@angular/common";
import localeFr from '@angular/common/locales/fr';
//
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { InMemoryDataService } from './shared/inmemory-db/inmemory-db.service';
import {Language} from "./shared/enums";
import {LayoutsModule} from "./layouts/layouts.module";
import {LoadingInterceptor} from "./core/interceptors/loader.interceptor";
import {AuthInterceptor} from "./core/interceptors/auth.interceptor";
import {provideGlobalNgbDatepickerConfig} from "./core/utils/date-picker/helper.provider";
import { FormTaskComponent } from './shared/components/form-task/form-task.component';

let lang = navigator.language.split('-')?.[0];
lang = Object.values(Language).includes(lang as Language) ? lang : 'fr';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    LayoutsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService, { passThruUnknownUrl: true }),
    AppRoutingModule,
    NgbModule,
  ],
  providers: [
    provideHttpClient(),
    provideTranslateService({
      lang: lang,
      fallbackLang: lang,
      loader: provideTranslateHttpLoader({
        prefix: 'assets/i18n/',
        suffix: '.json'
      })
    }),
    { provide: LOCALE_ID, useValue: 'fr' },
    provideGlobalNgbDatepickerConfig(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
