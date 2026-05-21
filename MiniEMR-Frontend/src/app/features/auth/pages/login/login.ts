import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    ReactiveFormsModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],

  templateUrl: './login.html',

  styleUrl: './login.css'
})
export class Login {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  isLoading = signal(false);
  ngOnInit() {
    // Any initialization logic can go here
    this.authService.logout(); // Ensure user is logged out when visiting the login page
  }

  loginForm = this.fb.nonNullable.group({

    username: ['', Validators.required],

    password: ['', Validators.required]
  });

  login(): void {

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.loginForm.getRawValue())
      .subscribe({

        next: response => {

          this.router.navigate(['/dashboard']);
          this.isLoading.set(false);
        },

        error: error => {

          console.error(error);

          this.isLoading.set(false);
        }
      });
  }
}