import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, PieChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
echarts.use([BarChart, GridComponent, CanvasRenderer, LegendComponent, TitleComponent, TooltipComponent, PieChart, LineChart]);

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardAgentComponent } from './dashboard-agent/dashboard-agent.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import {TranslatePipe} from "@ngx-translate/core";
import {HasPermissionDirective} from "../../shared/directives/permission.directive";

@NgModule({
    imports: [
        CommonModule,
        SharedComponentsModule,
        HasPermissionDirective,
        NgxEchartsModule.forRoot({ echarts }),
        NgbModule,
        NgScrollbarModule,
        DashboardRoutingModule,
        TranslatePipe
    ],
  declarations: [DashboardAgentComponent]
})
export class DashboardModule { }
