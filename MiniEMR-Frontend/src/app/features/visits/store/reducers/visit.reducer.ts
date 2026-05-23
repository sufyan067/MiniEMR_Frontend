import { createReducer, on } from '@ngrx/store';
import { initialVisitState } from '../state/visit.state';
import * as VisitActions from '../actions/visit.actions';

export const visitReducer = createReducer(
    initialVisitState,

    on(VisitActions.loadVisitStart, (state, { visitStart }) => ({
        ...state,
        visitStart
    })),

    on(VisitActions.updateClinicalNotes, (state, { chiefComplaint, visitNote, diagnosis }) => ({
        ...state,
        chiefComplaint,
        visitNote,
        diagnosis
    })),

    on(VisitActions.updateVitals, (state, { vital }) => ({
        ...state,
        vital
    })),

    on(VisitActions.updatePrescriptions, (state, { prescribedMedicines }) => ({
        ...state,
        prescribedMedicines
    })),

    on(VisitActions.saveVisit, (state) => ({
        ...state,
        loading: true,
        error: null,
        saved: false
    })),

    on(VisitActions.saveVisitSuccess, (state) => ({
        ...state,
        loading: false,
        saved: true,
        error: null
    })),

    on(VisitActions.saveVisitFailure, (state, { error }) => ({
        ...state,
        loading: false,
        saved: false,
        error
    })),

    on(VisitActions.resetVisit, () => ({ ...initialVisitState }))
);