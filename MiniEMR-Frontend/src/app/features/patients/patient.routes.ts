import { Routes } from '@angular/router';
import { authGuard } from '../../core/guarrds/auth.guard';
import { MainLayout } from '../../core/layouts/main-layout/main-layout';
export const PATIENT_ROUTES: Routes = [
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./pages/patient-list/patient-list')
                        .then(x => x.PatientList)
            },
            {
                path: ':id',
                loadComponent: () =>
                    import('./pages/patient-detail/patient-detail')
                        .then(x => x.PatientDetail)
            }
        ]
    }
];