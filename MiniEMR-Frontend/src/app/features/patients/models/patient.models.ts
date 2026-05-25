export interface PatientListResponse {
  patients: PatientListModel[];
}

export interface PatientListModel {
  patientId: number;
  fullName: string;
  age: number;
  gender: string;
  cnic: string;
  phoneNumber: string;
  bloodGroup: string | null;
  lastVisitDate: string | null;
}

export interface PatientVisitVitalModel {
  heightCm: number | null;
  weightKg: number | null;
  bMI: number | null;
  bPSystolic: number | null;
  bPDiastolic: number | null;
  pulseRate: number | null;
  temperatureF: number | null;
  respiratoryRate: number | null;
}

export interface PatientVisitPrescriptionModel {
  medicineId: number;
  medicineName: string;
  dosage: string;
  frequency: number;
  frequencyText: string;
  duration: string;
  instructions: string | null;
}

export interface PatientVisitHistoryModel {
  visitId: number;
  appointmentId: number;
  doctorName: string;
  appointmentDateTime: string;
  chiefComplaint: string;
  visitNote: string;
  diagnosis: string;
  vital: PatientVisitVitalModel | null;
  prescribedMedicines: PatientVisitPrescriptionModel[];
}

export interface PatientDetailModel {
  patientId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  cnic: string;
  phoneNumber: string;
  bloodGroup: string | null;
  address: string | null;
  createdAt: string;
  visitHistory: PatientVisitHistoryModel[];
}

export interface PatientRequestModel {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  cnic: string;
  phoneNumber: string;
  bloodGroup: string | null;
  address: string | null;
}
