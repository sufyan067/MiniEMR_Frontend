import { Routes } from '@angular/router';
import { authGuard } from '../../core/guarrds/auth.guard';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';
import { MainLayout } from '../../core/layouts/main-layout/main-layout';
export const VISIT_ROUTES: Routes = [
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            {
                path: 'start/:appointmentId',
                canDeactivate: [unsavedChangesGuard],
                loadComponent: () =>
                    import('./pages/visit-shell/visit-shell')
                        .then(x => x.VisitShell)
            },
            {
                path: 'view/:appointmentId',
                loadComponent: () =>
                    import('./pages/visit-view/visit-view')
                        .then(x => x.VisitView)
            }
        ]
    }
];