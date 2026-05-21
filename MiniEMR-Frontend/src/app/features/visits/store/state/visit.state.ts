export interface VisitState {
    chiefComplaint: string;
    visitNote: string;
    diagnosis: string;
    vital: {
        heightCm: number;
        weightKg: number;
        bmi: number;
        bpSystolic: number;
        bpDiastolic: number;
        pulseRate: number;
        temperatureF: number;
        respiratoryRate: number;
    };
    prescribedMedicines: any[];
}
export const initialVisitState: VisitState = {
    chiefComplaint: '',
    visitNote: '',
    diagnosis: '',
    vital: {
        heightCm: 0,
        weightKg: 0,
        bmi: 0,
        bpSystolic: 0,
        bpDiastolic: 0,
        pulseRate: 0,
        temperatureF: 0,
        respiratoryRate: 0
    },
    prescribedMedicines: []
};