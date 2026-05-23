import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  private snackBar = inject(MatSnackBar);
  private expiryWarningTimer: ReturnType<typeof setTimeout> | null = null;

  login(model: LoginRequestModel): Observable<LoginResponseModel> {
    return this.http.post<LoginResponseModel>(
      `${environment.apiUrl}/auth/login`,
      model
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response));
        this.authState.setUser(response);
        this.scheduleExpiryWarning();
      })
    );
  }

  restoreUser(): void {
    const user = localStorage.getItem('user');
    if (!user) return;
    this.authState.setUser(JSON.parse(user));
    this.scheduleExpiryWarning();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authState.clear();
    if (this.expiryWarningTimer) {
      clearTimeout(this.expiryWarningTimer);
      this.expiryWarningTimer = null;
    }
  }

  private scheduleExpiryWarning(): void {
    if (this.expiryWarningTimer) {
      clearTimeout(this.expiryWarningTimer);
    }
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresAtMs = payload.exp * 1000;
      const warningAtMs = expiresAtMs - 5 * 60 * 1000;
      const delay = warningAtMs - Date.now();
      if (delay > 0) {
        this.expiryWarningTimer = setTimeout(() => {
          this.snackBar.open(
            '⚠️ Your session expires in 5 minutes. Please save your work.',
            'Dismiss',
            { duration: 0, panelClass: 'snack-warn' }
          );
        }, delay);
      }
    } catch {
    }
  }
}