import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import * as VisitActions from '../actions/visit.actions';
import * as VisitSelectors from '../selectors/visit.selectors';
import { VisitService } from '../../services/visit.service';

@Injectable()
export class VisitEffects {
    private actions$ = inject(Actions);
    private visitService = inject(VisitService);
    private store = inject(Store);
    saveVisit$ = createEffect(() => this.actions$.pipe(
        ofType(VisitActions.saveVisit), withLatestFrom(this.store.select(VisitSelectors.selectVisitState)),
        switchMap(([_, state]) => this.visitService.saveVisit(state))),
        { dispatch: false }
    );
}