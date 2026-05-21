import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VisitService {
    private http = inject(HttpClient);
    getVisitStartData(
        appointmentId: number
    ): Observable<any> {
        return this.http.get(
            `${environment.apiUrl}/visit/${appointmentId}`
        );
    }
    getMedicines(): Observable<any> {
        return this.http.get(
            `${environment.apiUrl}/medicine`
        );
    }
    saveVisit(
        payload: any
    ): Observable<any> {
        return this.http.post(
            `${environment.apiUrl}/visit`,
            payload
        );
    }
}