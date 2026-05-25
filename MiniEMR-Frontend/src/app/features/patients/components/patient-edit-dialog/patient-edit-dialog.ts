import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
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
import { PatientDetailModel, PatientRequestModel } from '../../models/patient.models';

function cnicValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value ?? '';
  if (!value) return null;
  return /^\d{5}-\d{7}-\d{1}$/.test(value) ? null : { cnicFormat: true };
}

function cnicUniqueValidator(patientService: PatientService, excludeId: number): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value: string = control.value ?? '';
    if (!value || !/^\d{5}-\d{7}-\d{1}$/.test(value)) return of(null);
    return timer(400).pipe(
      switchMap(() => patientService.checkCnic(value, excludeId)),
      map(res => res.exists ? { cnicTaken: true } : null),
      catchError(() => of(null))
    );
  };
}

@Component({
  selector: 'app-patient-edit-dialog',
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
  templateUrl: './patient-edit-dialog.html',
  styleUrl: './patient-edit-dialog.css'
})
export class PatientEditDialog implements OnInit {
  private fb = inject(FormBuilder);
  private patientService = inject(PatientService);
  private dialogRef = inject(MatDialogRef<PatientEditDialog>);
  data = inject<PatientDetailModel>(MAT_DIALOG_DATA);

  saving = false;
  errorMessage = '';
  maxDate = new Date();

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    dateOfBirth: [null as Date | null, Validators.required],
    gender: ['', Validators.required],
    cNIC: ['', [cnicValidator], [cnicUniqueValidator(this.patientService, this.data.patientId)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9\-\+]{10,15}$/)]],
    bloodGroup: ['' as string],
    address: ['' as string]
  });

  get f() { return this.form.controls; }

  ngOnInit(): void {
    const d = this.data;
    this.form.patchValue({
      firstName: d.firstName,
      lastName: d.lastName,
      dateOfBirth: d.dateOfBirth ? new Date(d.dateOfBirth) : null,
      gender: d.gender,
      cNIC: d.cnic,
      phoneNumber: d.phoneNumber,
      bloodGroup: d.bloodGroup ?? '',
      address: d.address ?? ''
    });
  }

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
      cnic: v.cNIC || this.data.cnic || '',
      phoneNumber: v.phoneNumber,
      bloodGroup: v.bloodGroup || null,
      address: v.address || null
    };

    this.saving = true;
    this.errorMessage = '';

    this.patientService.updatePatient(this.data.patientId, payload).subscribe({
      next: () => {
        this.saving = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.saving = false;
        console.error('Update patient error:', err);
        const validationErrors = err?.error?.errors
          ? Object.values(err.error.errors).flat().join(' ')
          : null;
        this.errorMessage = validationErrors ?? err?.error?.message ?? 'Failed to update patient. Please try again.';
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
