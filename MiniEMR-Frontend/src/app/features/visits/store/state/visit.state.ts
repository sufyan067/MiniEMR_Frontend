import { VitalModel, PrescribedMedicineRequest, VisitStartModel } from '../../models/visit.models';

export interface VisitState {
    visitStart: VisitStartModel | null;
    chiefComplaint: string;
    visitNote: string;
    diagnosis: string;
    vital: VitalModel | null;
    prescribedMedicines: PrescribedMedicineRequest[];
    loading: boolean;
    saved: boolean;
    error: string | null;
}

export const initialVisitState: VisitState = {
    visitStart: null,
    chiefComplaint: '',
    visitNote: '',
    diagnosis: '',
    vital: null,
    prescribedMedicines: [],
    loading: false,
    saved: false,
    error: null
};