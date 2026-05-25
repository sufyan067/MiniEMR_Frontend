import { Injectable, signal } from '@angular/core';
import { LoginResponseModel } from '../models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthState {

  currentUser = signal<LoginResponseModel | null>(null);

  isAuthenticated = signal(false);

  setUser(user: LoginResponseModel): void {
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }

  clear(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }
}