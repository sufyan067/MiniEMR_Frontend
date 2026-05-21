import { createAction, props } from '@ngrx/store';
export const updateClinicalNotes = createAction('[Visit] Update Clinical Notes',
    props<{ chiefComplaint: string; visitNote: string; diagnosis: string; }>()
);
export const updateVitals = createAction(
    '[Visit] Update Vitals',
    props<{
        vital: any;
    }>()
);
export const updatePrescriptions =
    createAction('[Visit] Update Prescriptions', props<{ prescribedMedicines: any[]; }>());
export const saveVisit = createAction('[Visit] Save Visit');