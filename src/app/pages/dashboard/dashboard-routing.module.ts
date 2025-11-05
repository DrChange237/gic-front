import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardAgentComponent} from "./dashboard-agent/dashboard-agent.component";

const routes: Routes = [
  { path: '', component: DashboardAgentComponent, data: { title: 'navigation.dashboard' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
