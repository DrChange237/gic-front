import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OthersRoutingModule } from './others-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { RouterModule } from '@angular/router';
import {TranslatePipe} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        OthersRoutingModule,
        TranslatePipe
    ],
  declarations: [NotFoundComponent]
})
export class OthersModule { }
