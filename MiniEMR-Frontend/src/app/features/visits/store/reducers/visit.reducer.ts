import { createReducer, on } from '@ngrx/store';
import { initialVisitState } from '../state/visit.state';
import * as VisitActions from '../actions/visit.actions';
export const visitReducer = createReducer(initialVisitState,
    on(
        VisitActions.updateClinicalNotes,
        (state, action) => ({
            ...state,
            chiefComplaint:
                action.chiefComplaint,
            visitNote:
                action.visitNote,
            diagnosis:
                action.diagnosis
        })
    ),
    on(
        VisitActions.updateVitals,
        (state, action) => ({
            ...state,
            vital:
                action.vital
        })
    ),
    on(
        VisitActions.updatePrescriptions,
        (state, action) => ({
            ...state,
            prescribedMedicines:
                action.prescribedMedicines
        })
    )
);