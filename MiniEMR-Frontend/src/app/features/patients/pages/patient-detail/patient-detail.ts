import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientService } from '../../services/patient.service';
import { PatientDetailModel } from '../../models/patient.models';
import { PatientEditDialog } from '../../components/patient-edit-dialog/patient-edit-dialog';
import { AppointmentDialog } from '../../../appointments/components/appointment-dialog/appointment-dialog';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './patient-detail.html',
  styleUrl: './patient-detail.css'
})
export class PatientDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private patientService = inject(PatientService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  patient = signal<PatientDetailModel | null>(null);
  private patientId = 0;

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPatient();
  }

  private loadPatient(): void {
    this.patientService.getPatientById(this.patientId).subscribe(response => {
      this.patient.set(response);
    });
  }

  openEditDialog(): void {
    const p = this.patient();
    if (!p) return;
    const ref = this.dialog.open(PatientEditDialog, {
      width: '600px',
      disableClose: true,
      data: p
    });
    ref.afterClosed().subscribe(saved => {
      if (saved) {
        this.snackBar.open('Patient updated successfully!', 'Close', { duration: 3000, panelClass: 'snack-success' });
        this.loadPatient();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/patients']);
  }

  bookAppointment(): void {
    const p = this.patient();
    if (!p) return;
    const ref = this.dialog.open(AppointmentDialog, {
      width: '620px',
      disableClose: true,
      data: { patientId: p.patientId, fullName: p.fullName }
    });
    ref.afterClosed().subscribe(saved => {
      if (saved) {
        this.snackBar.open('Appointment booked successfully!', 'Close', { duration: 3000, panelClass: 'snack-success' });
      }
    });
  }
}