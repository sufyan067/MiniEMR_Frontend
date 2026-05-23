import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, withLatestFrom, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import * as VisitActions from '../actions/visit.actions';
import * as VisitSelectors from '../selectors/visit.selectors';
import { VisitService } from '../../services/visit.service';
import { VisitRequestModel } from '../../models/visit.models';

@Injectable()
export class VisitEffects {
    private actions$ = inject(Actions);
    private visitService = inject(VisitService);
    private store = inject(Store);
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);

    saveVisit$ = createEffect(() =>
        this.actions$.pipe(
            ofType(VisitActions.saveVisit),
            withLatestFrom(this.store.select(VisitSelectors.selectVisitState)),
            switchMap(([action, state]) => {
                const payload: VisitRequestModel = {
                    appointmentId: action.appointmentId,
                    chiefComplaint: state.chiefComplaint,
                    visitNote: state.visitNote,
                    diagnosis: state.diagnosis,
                    vital: state.vital,
                    prescribedMedicines: state.prescribedMedicines
                };
                return this.visitService.saveVisit(payload).pipe(
                    map(() => VisitActions.saveVisitSuccess()),
                    catchError(err => {
                        const msg = err?.error?.message ?? 'Visit save failed. Please try again.';
                        return of(VisitActions.saveVisitFailure({ error: msg }));
                    })
                );
            })
        )
    );

    saveVisitSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(VisitActions.saveVisitSuccess),
            map(() => {
                this.snackBar.open('Visit completed and saved successfully!', 'Close', {
                    duration: 4000,
                    panelClass: 'snack-success'
                });
                this.router.navigate(['/dashboard']);
                return VisitActions.resetVisit();
            })
        )
    );
}