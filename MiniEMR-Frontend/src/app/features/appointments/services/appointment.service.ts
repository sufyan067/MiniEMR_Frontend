import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class AppointmentService {
    private http = inject(HttpClient);
    getDoctors(): Observable<any> {
        return this.http.get(
            `${environment.apiUrl}/user`
        );
    }
    createAppointment(model: any): Observable<any> {
        return this.http.post(
            `${environment.apiUrl}/appointment`,
            model
        );
    }
}