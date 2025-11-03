import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './shared/inmemory-db/inmemory-db.service';
import {HttpClientModule, provideHttpClient} from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import {provideTranslateService} from "@ngx-translate/core";
import {Language} from "./shared/enums";
import {registerLocaleData} from "@angular/common";
import localeFr from '@angular/common/locales/fr';
import {LayoutsModule} from "./layouts/layouts.module";

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
    { provide: LOCALE_ID, useValue: 'fr' },
    provideHttpClient(),
    provideTranslateService({
      lang: lang,
      fallbackLang: lang,
      loader: provideTranslateHttpLoader({
        prefix: 'assets/i18n/',
        suffix: '.json'
      })
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
