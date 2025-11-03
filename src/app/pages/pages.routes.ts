import {Routes} from "@angular/router";

export const pagesRoutes: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('../views/dashboard/dashboard.module').then(m => m.DashboardModule)
    },
]
