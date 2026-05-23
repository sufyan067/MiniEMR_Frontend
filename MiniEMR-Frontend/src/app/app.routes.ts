import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',

    redirectTo: 'login',

    pathMatch: 'full'
  },

  {
    path: 'login',

    loadChildren: () =>
      import('./features/auth/auth.routes')
        .then(x => x.AUTH_ROUTES)
  },

  {
    path: 'dashboard',

    loadChildren: () =>
      import('./features/dashboard/dashboard.routes')
        .then(x => x.DASHBOARD_ROUTES)
  },
  {
    path: 'patients',
    loadChildren: () =>
      import('./features/patients/patient.routes')
        .then(x => x.PATIENT_ROUTES)
  },
  {
  path: 'appointments',

  loadChildren: () =>
    import('./features/appointments/appointment.routes')
      .then(x => x.APPOINTMENT_ROUTES)
},
{
  path: 'visits',

  loadChildren: () =>
    import('./features/visits/visit.routes')
      .then(x => x.VISIT_ROUTES)
}
];