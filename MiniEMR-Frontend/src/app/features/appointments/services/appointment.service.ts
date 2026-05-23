import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface AppointmentRequestModel {
  patientId: number;
  doctorId: number;
  appointmentDateTime: string;
  notes?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {
    private http = inject(HttpClient);

    getDoctors(): Observable<any> {
        return this.http.get<any>(
            `${environment.apiUrl}/user`
        );
    }

    getPatients(): Observable<{ patients: any[] }> {
        return this.http.get<{ patients: any[] }>(
            `${environment.apiUrl}/patient`
        );
    }

    createAppointment(model: AppointmentRequestModel): Observable<void> {
        return this.http.post<void>(
            `${environment.apiUrl}/appointment`,
            model
        );
    }
}