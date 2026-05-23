export interface MedicineModel {
  medicineId: number;
  medicineName: string;
  genericName: string;
  dosageValue: number;
  dosageUnit: string;
  displayText: string;
}

export interface VitalModel {
  heightCm: number | null;
  weightKg: number | null;
  bMI: number | null;
  bPSystolic: number | null;
  bPDiastolic: number | null;
  pulseRate: number | null;
  temperatureF: number | null;
  respiratoryRate: number | null;
}

export interface PrescribedMedicineRequest {
  medicineId: number;
  dosage: string;
  frequency: number;
  duration: string;
  instructions: string | null;
}

export interface VisitStartModel {
  appointmentId: number;
  patientId: number;
  patientName: string;
  age: number;
  gender: string;
  doctorId: number;
  doctorName: string;
  appointmentDateTime: string;
}

export interface VisitRequestModel {
  appointmentId: number;
  chiefComplaint: string;
  visitNote: string;
  diagnosis: string;
  vital: VitalModel | null;
  prescribedMedicines: PrescribedMedicineRequest[];
}

export interface PrescribedMedicineResponse {
  medicineId: number;
  medicineName: string;
  dosage: string;
  frequency: number;
  frequencyText: string;
  duration: string;
  instructions: string | null;
}

export interface VisitDetailModel {
  visitId: number;
  appointmentId: number;
  patientName: string;
  age: number;
  gender: string;
  doctorName: string;
  appointmentDateTime: string;
  chiefComplaint: string;
  visitNote: string;
  diagnosis: string;
  vital: VitalModel | null;
  prescribedMedicines: PrescribedMedicineResponse[];
}
