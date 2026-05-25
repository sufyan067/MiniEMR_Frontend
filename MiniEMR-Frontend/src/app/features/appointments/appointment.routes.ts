import { Routes } from '@angular/router';
import { authGuard } from '../../core/guarrds/auth.guard';
import { MainLayout } from '../../core/layouts/main-layout/main-layout';
export const APPOINTMENT_ROUTES: Routes = [
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./pages/appointment-list/appointment-list')
                        .then(x => x.AppointmentList)
            }
        ]
    }
];