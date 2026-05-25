import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { take, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectVisitDirty } from '../../features/visits/store/selectors/visit.selectors';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';

export const unsavedChangesGuard: CanDeactivateFn<unknown> = () => {
  const store = inject(Store);
  const dialog = inject(MatDialog);

  return store.select(selectVisitDirty).pipe(
    take(1),
    switchMap(isDirty => {
      if (!isDirty) return of(true);
      const ref = dialog.open(ConfirmDialog, {
        width: '420px',
        data: {
          title: 'Unsaved Visit Data',
          message: 'You have unsaved changes in this visit. If you leave now, all entered data will be lost.',
          confirmText: 'Leave Anyway',
          cancelText: 'Stay on Page'
        }
      });
      return ref.afterClosed().pipe(map(result => !!result));
    })
  );
};
