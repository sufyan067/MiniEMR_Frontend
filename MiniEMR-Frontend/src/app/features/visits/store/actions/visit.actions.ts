import { createAction, props } from '@ngrx/store';
import { VitalModel, PrescribedMedicineRequest, VisitStartModel } from '../../models/visit.models';

export const loadVisitStart = createAction(
    '[Visit] Load Visit Start',
    props<{ visitStart: VisitStartModel }>()
);

export const updateClinicalNotes = createAction(
    '[Visit] Update Clinical Notes',
    props<{ chiefComplaint: string; visitNote: string; diagnosis: string }>()
);

export const updateVitals = createAction(
    '[Visit] Update Vitals',
    props<{ vital: VitalModel }>()
);

export const updatePrescriptions = createAction(
    '[Visit] Update Prescriptions',
    props<{ prescribedMedicines: PrescribedMedicineRequest[] }>()
);

export const saveVisit = createAction(
    '[Visit] Save Visit',
    props<{ appointmentId: number }>()
);

export const saveVisitSuccess = createAction('[Visit] Save Visit Success');

export const saveVisitFailure = createAction(
    '[Visit] Save Visit Failure',
    props<{ error: string }>()
);

export const resetVisit = createAction('[Visit] Reset');