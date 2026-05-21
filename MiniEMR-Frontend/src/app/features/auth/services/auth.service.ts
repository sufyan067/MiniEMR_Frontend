import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginRequestModel } from '../models/login-request.model';
import { LoginResponseModel } from '../models/login-response.model';
import { AuthState } from '../state/auth.state';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private authState = inject(AuthState);
  login(model: LoginRequestModel): Observable<LoginResponseModel> {
    return this.http.post<LoginResponseModel>(
      `${environment.apiUrl}/auth/login`,
      model
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.authState.setUser(response);
      })
    );
  }
  logout(): void {
    localStorage.removeItem('token');
    this.authState.clear();
  }
}