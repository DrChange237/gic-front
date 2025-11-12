import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CommonModule} from "@angular/common";

const routes: Routes = [
  {
    path: 'dashboard',
    data: { title: 'navigation.dashboard' },
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'transactions',
    children: [
      {
        path: 'services',
        data: { title: 'navigation.services' },
        loadComponent: () => import('./transactions/trx-services/trx-services.component').then(c => c.TrxServicesComponent)
      },
      {
        path: 'history',
        data: { title: 'navigation.history' },
        children: [
          {
            path: 'agent',
            data: { title: 'navigation.history_agent' },
            loadComponent:  () => import('./transactions/trx-history/trx-history.component').then(c => c.TrxHistoryComponent)
          },
          {
            path: 'agency',
            data: { title: 'navigation.history_agency', history: 'agent' },
            loadComponent:  () => import('./transactions/trx-history/trx-history.component').then(c => c.TrxHistoryComponent)
          },
          {
            path: 'all',
            data: { title: 'navigation.history_global', history: 'agency' },
            loadComponent:  () => import('./transactions/trx-history/trx-history.component').then(c => c.TrxHistoryComponent)
          },
          { path: '', redirectTo: 'agent', pathMatch: 'full' }
        ]
      },
      {
        path: 'reporting',
        data: { title: 'navigation.reporting' },
        loadComponent: () => import('./transactions/reporting/reporting.component').then(c => c.ReportingComponent)
      },
      { path: '', redirectTo: 'service', pathMatch: 'full' }
    ]
  },
  {
    path: 'management',
    data: { title: 'navigation.management' },
    children: [
      {
        path: 'role-and-profile',
        data: { title: 'navigation.role_profile' },
        loadComponent: () => import('./management/mgn-role/mgn-role.component').then(c => c.MgnRoleComponent)
      },
      {
        path: 'agencies',
        data: { title: 'navigation.agencies' },
        loadComponent: () => import('./management/mgn-agencies/mgn-agencies.component').then(c => c.MgnAgenciesComponent)
      },
      {
        path: 'agents',
        data: { title: 'navigation.agents' },
        loadComponent: () => import('./management/mgn-agents/mgn-agents.component').then(c => c.MgnAgentsComponent)
      },
      { path: '', redirectTo: 'agencies', pathMatch: 'full' }
    ]
  },
  {
    path: 'account-settings',
    data: { title: 'navigation.account_settings' },
    loadComponent: () => import('./user-settings/user-settings.component').then(c => c.UserSettingsComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
