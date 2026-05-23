import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PatientDetailModel, PatientListModel, PatientListResponse, PatientRequestModel } from '../models/patient.models';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private http = inject(HttpClient);

  getPatients(): Observable<PatientListResponse> {
    return this.http.get<PatientListResponse>(
      `${environment.apiUrl}/patient`
    );
  }

  getPatientById(id: number): Observable<PatientDetailModel> {
    return this.http.get<PatientDetailModel>(
      `${environment.apiUrl}/patient/${id}`
    );
  }

  createPatient(payload: PatientRequestModel): Observable<PatientDetailModel> {
    return this.http.post<PatientDetailModel>(
      `${environment.apiUrl}/patient`,
      payload
    );
  }

  updatePatient(id: number, payload: PatientRequestModel): Observable<void> {
    return this.http.put<void>(
      `${environment.apiUrl}/patient/${id}`,
      payload
    );
  }
}