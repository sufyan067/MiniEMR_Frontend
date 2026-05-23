import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VisitState } from '../state/visit.state';

export const selectVisitState = createFeatureSelector<VisitState>('visit');

export const selectVisitStart = createSelector(selectVisitState, s => s.visitStart);

export const selectClinicalNotes = createSelector(selectVisitState, s => ({
    chiefComplaint: s.chiefComplaint,
    visitNote: s.visitNote,
    diagnosis: s.diagnosis
}));

export const selectVitals = createSelector(selectVisitState, s => s.vital);

export const selectPrescriptions = createSelector(selectVisitState, s => s.prescribedMedicines);

export const selectVisitLoading = createSelector(selectVisitState, s => s.loading);

export const selectVisitSaved = createSelector(selectVisitState, s => s.saved);

export const selectVisitError = createSelector(selectVisitState, s => s.error);

export const selectVisitDirty = createSelector(selectVisitState, s =>
  !s.saved && (
    s.chiefComplaint.trim() !== '' ||
    s.visitNote.trim() !== '' ||
    s.diagnosis.trim() !== '' ||
    s.vital !== null ||
    s.prescribedMedicines.length > 0
  )
);