import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {TranslatePipe} from "@ngx-translate/core";
//
import {SharedModule} from "../shared/shared.module";
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './blank-layout/blank-layout.component';
import { AdminLayoutSidebarLargeComponent } from './admin-layout-sidebar-large/admin-layout-sidebar-large.component';
import { HeaderSidebarLargeComponent } from './admin-layout-sidebar-large/header-sidebar-large/header-sidebar-large.component';
import { SidebarLargeComponent } from './admin-layout-sidebar-large/sidebar-large/sidebar-large.component';
import {SharedComponentsModule} from "../shared/components/shared-components.module";

// Regular layouts for declaration
const components = [
    HeaderSidebarLargeComponent,
    SidebarLargeComponent,
    AdminLayoutSidebarLargeComponent,
    AuthLayoutComponent,
    BlankLayoutComponent,
];


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgbModule,
        RouterModule,
        FormsModule,
        NgScrollbarModule,
        CommonModule,
        TranslatePipe,
        SharedComponentsModule,
        // Import standalone layouts
    ],
  declarations: components,
  exports: [...components]
})
export class LayoutsModule { }
