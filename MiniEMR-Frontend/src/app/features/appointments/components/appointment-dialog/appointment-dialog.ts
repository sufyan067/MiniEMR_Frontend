import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AppointmentService } from '../../services/appointment.service';
import { formatDate } from '@angular/common';

export interface AppointmentDialogData {
  patientId?: number;
  fullName?: string;
  doctorId?: number;
  doctorName?: string;
}

@Component({
  selector: 'app-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './appointment-dialog.html',
  styleUrl: './appointment-dialog.css'
})
export class AppointmentDialog implements OnInit {
  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentService);
  dialogRef = inject(MatDialogRef<AppointmentDialog>);

  doctors = signal<any[]>([]);
  patients = signal<any[]>([]);
  isSaving = signal(false);
  errorMessage = '';
  selectedTimeSlot = signal<string>('');
  minDate = new Date();

  hasPreselectedPatient = false;
  hasPreselectedDoctor = false;

  form = this.fb.nonNullable.group({
    patientId: [0, [Validators.required, Validators.min(1)]],
    doctorId: [0, [Validators.required, Validators.min(1)]],
    appointmentDate: [null as Date | null, Validators.required],
    notes: ['']
  });

  timeSlots = [
    '09:00 AM', '09:30 AM',
    '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM'
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: AppointmentDialogData) {}

  ngOnInit(): void {
    this.loadDoctors();
    if (this.data?.patientId) {
      this.hasPreselectedPatient = true;
      this.form.patchValue({ patientId: this.data.patientId });
    } else {
      this.loadPatients();
    }
    if (this.data?.doctorId) {
      this.hasPreselectedDoctor = true;
      this.form.patchValue({ doctorId: this.data.doctorId });
      this.form.controls.doctorId.disable();
    }
  }

  private loadDoctors(): void {
    this.appointmentService.getDoctors().subscribe(response => {
      const allUsers: any[] = Array.isArray(response)
        ? response
        : (response.users ?? []);
      this.doctors.set(
        allUsers.filter((x: any) => x.role === 'Doctor' || x.role === 2)
      );
    });
  }

  private loadPatients(): void {
    this.appointmentService.getPatients().subscribe(response => {
      this.patients.set(response.patients ?? []);
    });
  }

  selectTimeSlot(slot: string): void {
    this.selectedTimeSlot.set(slot);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.selectedTimeSlot()) {
      this.errorMessage = 'Please select an appointment time.';
      return;
    }

    this.isSaving.set(true);
    this.errorMessage = '';

    const v = this.form.getRawValue();
    const appointmentDate = new Date(v.appointmentDate!);
    const [time, modifier] = this.selectedTimeSlot().split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    appointmentDate.setHours(hours, minutes, 0, 0);

    const pad = (n: number) => String(n).padStart(2, '0');
    const localISO = `${appointmentDate.getFullYear()}-${pad(appointmentDate.getMonth() + 1)}-${pad(appointmentDate.getDate())}T${pad(appointmentDate.getHours())}:${pad(appointmentDate.getMinutes())}:00`;

    this.appointmentService.createAppointment({
      patientId: v.patientId,
      doctorId: v.doctorId,
      appointmentDateTime: localISO,
      notes: v.notes || undefined
    }).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage = err?.error?.message ?? 'Failed to book appointment. Please try again.';
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}