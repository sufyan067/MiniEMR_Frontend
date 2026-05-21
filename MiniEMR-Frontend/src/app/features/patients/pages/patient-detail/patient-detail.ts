import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PatientService } from '../../services/patient.service';
import { MatDialog } from '@angular/material/dialog';
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
  private patientService = inject(PatientService);
  private dialog = inject(MatDialog);
  patient = signal<any>(null);
  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );
    this.loadPatient(id);
  }
  private loadPatient(id: number): void {
    this.patientService
      .getPatientById(id)
      .subscribe(response => {
        this.patient.set(response);
      });
  }
  bookAppointment(): void {
    this.dialog.open(
      AppointmentDialog,
      {
        width: '800px',
        data: {
          patientId:
            this.patient()?.patientId,
          fullName:
            this.patient()?.fullName
        }
      }
    );
  }
}