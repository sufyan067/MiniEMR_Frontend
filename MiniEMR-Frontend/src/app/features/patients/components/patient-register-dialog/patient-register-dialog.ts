import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Observable, of, timer } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { PatientService } from '../../services/patient.service';
import { PatientRequestModel } from '../../models/patient.models';
import { formatDate } from '@angular/common';

function cnicValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value ?? '';
  return /^\d{5}-\d{7}-\d{1}$/.test(value) ? null : { cnicFormat: true };
}

function cnicUniqueValidator(patientService: PatientService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value: string = control.value ?? '';
    if (!/^\d{5}-\d{7}-\d{1}$/.test(value)) return of(null);
    return timer(400).pipe(
      switchMap(() => patientService.checkCnic(value)),
      map(res => res.exists ? { cnicTaken: true } : null),
      catchError(() => of(null))
    );
  };
}

@Component({
  selector: 'app-patient-register-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './patient-register-dialog.html',
  styleUrl: './patient-register-dialog.css'
})
export class PatientRegisterDialog {
  private fb = inject(FormBuilder);
  private patientService = inject(PatientService);
  private dialogRef = inject(MatDialogRef<PatientRegisterDialog>);

  saving = false;
  errorMessage = '';
  maxDate = new Date();

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    dateOfBirth: [null as Date | null, Validators.required],
    gender: ['', Validators.required],
    cNIC: ['', [Validators.required, cnicValidator], [cnicUniqueValidator(this.patientService)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9\-\+]{10,15}$/)]],
    bloodGroup: ['' as string],
    address: ['' as string]
  });

  get f() { return this.form.controls; }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const payload: PatientRequestModel = {
      firstName: v.firstName,
      lastName: v.lastName,
      dateOfBirth: formatDate(v.dateOfBirth!, 'yyyy-MM-dd', 'en-US'),
      gender: v.gender,
      cnic: v.cNIC,
      phoneNumber: v.phoneNumber,
      bloodGroup: v.bloodGroup || null,
      address: v.address || null
    };

    this.saving = true;
    this.errorMessage = '';

    this.patientService.createPatient(payload).subscribe({
      next: () => {
        this.saving = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.message ?? 'Failed to register patient. Please try again.';
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
