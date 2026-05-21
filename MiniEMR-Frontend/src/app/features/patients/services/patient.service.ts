import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private http = inject(HttpClient);
  getPatients(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/patient`
    );
  }
  getPatientById(id: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/patient/${id}`
    );
  }
}