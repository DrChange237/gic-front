import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
//
import { AuthRoutingModule } from './auth-routing.module';
import { SigninComponent } from './signin/signin.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import {TranslatePipe} from "@ngx-translate/core";
import {NgbAlert} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        SharedComponentsModule,
        AuthRoutingModule,
        TranslatePipe,
        NgbAlert
    ],
  declarations: [SigninComponent, ForgotComponent]
})
export class AuthModule { }
