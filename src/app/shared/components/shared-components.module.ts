import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnLoadingComponent } from './btn-loading/btn-loading.component';
import { FeatherIconComponent } from './feather-icon/feather-icon.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { SharedPipesModule } from '../pipes/shared-pipes.module';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import {FooterComponent} from "./footer/footer.component";
import {CustomizerComponent} from "./customizer/customizer.component";
import {BreadcrumbComponent} from "./breadcrumb/breadcrumb.component";
import {TranslatePipe} from "@ngx-translate/core";

const components = [
  BtnLoadingComponent,
  FeatherIconComponent,
  FooterComponent,
  CustomizerComponent,
  BreadcrumbComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedPipesModule,
    SharedDirectivesModule,
    NgScrollbarModule,
    NgbModule,
    TranslatePipe
  ],
  declarations: components,
  exports: [components]
})
export class SharedComponentsModule { }
