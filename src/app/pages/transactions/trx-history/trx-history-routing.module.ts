import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'agent',
    data: { title: 'navigation.history_agent' },
    loadComponent: () => import('./user-history/user-history.component').then(c => c.UserHistoryComponent)
  },
  {
    path: 'agency',
    data: { title: 'navigation.history_agency' },
    loadComponent: () => import('./agency-history/agency-history.component').then(c => c.AgencyHistoryComponent)
  },
  {
    path: 'all',
    data: { title: 'navigation.history_global' },
    loadComponent: () => import('./global-history/global-history.component').then(c => c.GlobalHistoryComponent)
  },
  { path: '', redirectTo: 'agent', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule]
})
export class TrxHistoryRoutingModule { }
