import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VisitState } from '../state/visit.state';
export const selectVisitState = createFeatureSelector<VisitState>('visit');
export const selectClinicalNotes = createSelector(selectVisitState,
    state => ({
        chiefComplaint:
            state.chiefComplaint,
        visitNote:
            state.visitNote,
        diagnosis:
            state.diagnosis
    })
);
export const selectVitals = createSelector(selectVisitState, state => state.vital);
export const selectPrescriptions = createSelector(selectVisitState, state => state.prescribedMedicines);