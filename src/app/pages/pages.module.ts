import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {PagesRoutingModule} from "./pages-routing.module";

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    NgScrollbarModule,
    PagesRoutingModule,
  ],
  declarations: []
})
export class PagesModule { }
