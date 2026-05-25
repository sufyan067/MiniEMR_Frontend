import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthState } from '../../features/auth/state/auth.state';

export const roleGuard = (requiredRole: string): CanActivateFn => () => {
  const authState = inject(AuthState);
  const router = inject(Router);

  const user = authState.currentUser();
  if (user?.role === requiredRole) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
