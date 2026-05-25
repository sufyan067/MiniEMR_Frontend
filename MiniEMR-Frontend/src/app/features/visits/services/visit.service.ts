import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MedicineModel, VisitDetailModel, VisitRequestModel, VisitStartModel } from '../models/visit.models';

@Injectable({
    providedIn: 'root'
})
export class VisitService {
    private http = inject(HttpClient);

    getVisitStartData(appointmentId: number): Observable<VisitStartModel> {
        return this.http.get<VisitStartModel>(
            `${environment.apiUrl}/visit/${appointmentId}`
        );
    }

    getMedicines(): Observable<MedicineModel[]> {
        return this.http.get<MedicineModel[]>(
            `${environment.apiUrl}/medicine`
        );
    }

    saveVisit(payload: VisitRequestModel): Observable<void> {
        return this.http.post<void>(
            `${environment.apiUrl}/visit`,
            payload
        );
    }

    getVisitDetail(visitId: number): Observable<VisitDetailModel> {
        return this.http.get<VisitDetailModel>(
            `${environment.apiUrl}/visit/${visitId}/detail`
        );
    }

    getVisitDetailByAppointmentId(appointmentId: number): Observable<VisitDetailModel> {
        return this.http.get<VisitDetailModel>(
            `${environment.apiUrl}/visit/${appointmentId}/detail`
        );
    }
}