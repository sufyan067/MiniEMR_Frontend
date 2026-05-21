import { Routes } from '@angular/router';
import { authGuard } from '../../core/guarrds/auth.guard';
import { MainLayout } from '../../core/layouts/main-layout/main-layout';
export const DASHBOARD_ROUTES: Routes = [

  {
    path: '',

    component: MainLayout,

    canActivate: [authGuard],

    children: [

      {
        path: '',

        loadComponent: () =>
          import('./pages/dashboard/dashboard')
            .then(x => x.Dashboard)
      }
    ]
  }
];