import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentService } from '../../services/appointment.service';
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
    MatSnackBarModule
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './appointment-dialog.html',
  styleUrl: './appointment-dialog.css'
})
export class AppointmentDialog implements OnInit {
  private fb = inject(FormBuilder);
  private appointmentService =
    inject(AppointmentService);
  private snackBar =
    inject(MatSnackBar);
  dialogRef =
    inject(MatDialogRef<AppointmentDialog>);
  doctors = signal<any[]>([]);
  isSaving = signal(false);
  selectedTimeSlot = signal<string>('');
  appointmentForm =
    this.fb.nonNullable.group({
      doctorId: [
        0,
        [Validators.required, Validators.min(1)]
      ],
      appointmentDate: [
        '',
        Validators.required
      ],
      notes: ['']
    });
  timeSlots = [

    '09:00 AM',
    '09:30 AM',

    '10:00 AM',
    '10:30 AM',

    '11:00 AM',
    '11:30 AM',

    '02:00 PM',
    '02:30 PM',

    '03:00 PM',
    '03:30 PM',

    '04:00 PM',
    '04:30 PM'
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
  }

  ngOnInit(): void {
    this.loadDoctors();
  }
  private loadDoctors(): void {
    this.appointmentService
      .getDoctors()
      .subscribe(response => {
        const doctors =
          response.users.filter(
            (x: any) => x.role === 'Doctor'
          );
        this.doctors.set(doctors);
      });
  }
  selectTimeSlot(slot: string): void {
    this.selectedTimeSlot.set(slot);
  }
  save(): void {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }
    if (!this.selectedTimeSlot()) {
      this.snackBar.open(
        'Please select appointment time',
        'Close',
        {
          duration: 3000
        }
      );
      return;
    }
    this.isSaving.set(true);
    const form =
      this.appointmentForm.getRawValue();
    const appointmentDate =
      new Date(form.appointmentDate);
    const [time, modifier] =
      this.selectedTimeSlot().split(' ');
    let [hours, minutes] =
      time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    appointmentDate.setHours(hours);
    appointmentDate.setMinutes(minutes);
    const payload = {
      patientId: this.data.patientId,
      doctorId: form.doctorId,

      appointmentDateTime:
        appointmentDate.toISOString(),
      notes: form.notes
    };
    this.appointmentService
      .createAppointment(payload)
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.snackBar.open(
            'Appointment booked successfully',
            'Close',
            {
              duration: 3000
            }
          );
          this.dialogRef.close(true);
        },
        error: () => {
          this.isSaving.set(false);
        }
      });
  }
}