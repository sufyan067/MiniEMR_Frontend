import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private http = inject(HttpClient);
    getSummary(): Observable<any> {
        return this.http.get(
            `${environment.apiUrl}/appointment/summary`
        );
    }
    getAppointments(
        date?: string,
        status?: string
    ): Observable<any> {
        let url =
            `${environment.apiUrl}/appointment`;
        const queryParams: string[] = [];
        if (date) {
            queryParams.push(`date=${date}`);
        }
        if (status && status !== 'All') {
            queryParams.push(`status=${status}`);
        }
        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
        }
        return this.http.get(url);
    }
    updateAppointmentStatus(
        appointmentId: number,
        status: number
    ): Observable<any> {

        return this.http.put(
            `${environment.apiUrl}/appointment/${appointmentId}/status`,
            {
                status
            }
        );
    }
}