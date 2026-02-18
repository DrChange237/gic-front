import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CommonModule} from "@angular/common";
import {PermissionGuard} from "../core/guards/permission-guard.service";
import {Permission} from "../shared/enums/permission";

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [PermissionGuard],
    data: { title: 'navigation.dashboard', permissions: [Permission.DASHBOARD_VIEW] },
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'transactions',
    children: [
      { path: '', redirectTo: 'services', pathMatch: 'full' },
      {
        path: 'services',
        data: { title: 'navigation.services' },
        loadComponent: () => import('./transactions/trx-services/trx-services.component').then(c => c.TrxServicesComponent)
      },
      {
        path: 'history',
        data: { title: 'navigation.tasklist' },
        children: [
          { path: '', redirectTo: 'agent', pathMatch: 'full' },

          {
            path: 'agent',
            data: { title: 'navigation.mytasks' },
            loadComponent:  () => import('./transactions/trx-history/trx-history.component').then(c => c.TrxHistoryComponent)
          },
          {
            path: 'alltasks',
            data: { title: 'navigation.alltasks' },
            loadComponent:  () => import('./transactions/trx-mycases/trx-mycases.component').then(c => c.TrxMyCasesComponent)
          },
          {
            path: 'agent/:data',
            canActivate: [PermissionGuard],
            data: { title: 'navigation.history_cashier', permissions: [Permission.HISTORY_CASHIER_VIEW] },
            loadComponent:  () => import('./transactions/trx-history/trx-history.component').then(c => c.TrxHistoryComponent)
          },
          {
            path: 'agency',
            canActivate: [PermissionGuard],
            data: { title: 'navigation.history_agency', history: 'agency', permissions: [Permission.HISTORY_AGENCY_VIEW] },
            loadComponent:  () => import('./transactions/trx-history/trx-history.component').then(c => c.TrxHistoryComponent)
          },
          {
            path: 'agency/:data',
            canActivate: [PermissionGuard],
            data: { title: 'navigation.history_agency', history: 'agency', permissions: [Permission.HISTORY_AGENCY_VIEW] },
            loadComponent:  () => import('./transactions/trx-history/trx-history.component').then(c => c.TrxHistoryComponent)
          },
          {
            path: 'all',
            canActivate: [PermissionGuard],
            data: { title: 'navigation.history_global', history: 'global', permissions: [Permission.HISTORY_AGENTS_VIEW] },
            loadComponent:  () => import('./transactions/trx-history/trx-history.component').then(c => c.TrxHistoryComponent)
          }
        ]
      },
    ]
  },
  {
    path: 'reporting',
    //canActivate: [PermissionGuard],
    data: { title: 'navigation.reporting' /*, permissions: [Permission.REPORT_VIEW]*/ },
    loadComponent: () => import('./reporting/reporting.component').then(c => c.ReportingComponent)
  },
  {
    path: 'management',
    data: { title: 'navigation.management' },
    children: [
      { path: '', redirectTo: 'agency/agents', pathMatch: 'full' },

      {
        path: 'role-and-profile',
        canActivate: [PermissionGuard],
        data: { title: 'navigation.role_profile', permissions: [Permission.ROLE_VIEW] },
        loadComponent: () => import('./management/mgn-role/mgn-role.component').then(c => c.MgnRoleComponent)
      },
      {
        path: 'inscriptions',
        canActivate: [PermissionGuard],
        data: { title: 'navigation.inscriptions', permissions: [] },
        loadComponent: () => import('./management/mgn-inscriptions/mgn-inscriptions.component').then(c => c.MgnInscriptionsComponent)
      },
       {
        path: 'dossiers',
        canActivate: [PermissionGuard],
        data: { title: 'navigation.dossiers', permissions: [] },
        loadComponent: () => import('./management/mgn-dossiers/mgn-dossiers.component').then(c => c.MgnDossiersComponent)
      },
      {
        path: 'agencies',
        canActivate: [PermissionGuard],
        data: { title: 'navigation.agencies', permissions: [Permission.AGENCY_VIEW] },
        loadComponent: () => import('./management/mgn-agencies/mgn-agencies.component').then(c => c.MgnAgenciesComponent)
      },
      {
        path: 'agents/all',
        canActivate: [PermissionGuard],
        data: { title: 'navigation.agents', list: 'all', permissions: [Permission.CASHIER_ALL_VIEW] },
        loadComponent: () => import('./management/mgn-agents/mgn-agents.component').then(c => c.MgnAgentsComponent)
      },
      {
        path: 'agency/agents',
        canActivate: [PermissionGuard],
        data: { title: 'navigation.my_agents', permissions: [Permission.CASHIER_VIEW] },
        loadComponent: () => import('./management/mgn-agents/mgn-agents.component').then(c => c.MgnAgentsComponent)
      },
      {
        path: 'operation-review',
        canActivate: [PermissionGuard],
        data: { title: 'navigation.operation_review', permissions: [] },
        loadComponent: () => import('./management/mgn-operation-review/mgn-operation-review.component').then(c => c.MgnOperationReviewComponent)
      },
      {
        path: 'operation-review/:data',
        canActivate: [PermissionGuard],
        data: { title: 'navigation.operation_review', permissions: [] },
        loadComponent: () => import('./management/mgn-operation-review/mgn-operation-review.component').then(c => c.MgnOperationReviewComponent)
      },
      {
        path: 'transfer-fund',
        canActivate: [PermissionGuard],
        data: { title: 'navigation.transfer_fund', permissions: [Permission.FUNDS_TRANSFER_VIEW] },
        loadComponent: () => import('./management/mgn-fund-transfer/mgn-fund-transfer.component').then(c => c.MgnFundTransfer)
      },
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
export class ViewsRoutingModule { }
