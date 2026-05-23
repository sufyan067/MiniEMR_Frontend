import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientService } from '../../services/patient.service';
import { PatientListModel } from '../../models/patient.models';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { PatientRegisterDialog } from '../../components/patient-register-dialog/patient-register-dialog';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.css'
})
export class PatientList implements OnInit {
  private patientService = inject(PatientService);
  private dashboardService = inject(DashboardService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  patients = signal<PatientListModel[]>([]);
  searchText = signal('');

  filteredPatients = computed(() => {
    const search = this.searchText().toLowerCase();
    return this.patients().filter(x =>
      (x.fullName ?? '').toLowerCase().includes(search) ||
      (x.phoneNumber ?? '').toLowerCase().includes(search) ||
      (x.cnic ?? '').toLowerCase().includes(search)
    );
  });

  ngOnInit(): void {
    this.loadPatients();
  }

  private loadPatients(): void {
    forkJoin({
      patients: this.patientService.getPatients(),
      completed: this.dashboardService.getAppointments(undefined, '3')
    }).subscribe(({ patients, completed }) => {
      const list: PatientListModel[] = patients.patients ?? [];
      const completedList: any[] = Array.isArray(completed) ? completed : [];

      const lastVisitMap = new Map<number, string>();
      for (const appt of completedList) {
        const pid = Number(appt.patientId);
        const dt: string = appt.appointmentDateTime ?? '';
        if (dt && (!lastVisitMap.has(pid) || dt > lastVisitMap.get(pid)!)) {
          lastVisitMap.set(pid, dt);
        }
      }

      this.patients.set(list.map(p => ({
        ...p,
        lastVisitDate: lastVisitMap.get(p.patientId) ?? null
      })));
    });
  }

  viewPatient(id: number): void {
    this.router.navigate(['/patients', id]);
  }

  openRegisterDialog(): void {
    const ref = this.dialog.open(PatientRegisterDialog, {
      width: '560px',
      disableClose: true
    });
    ref.afterClosed().subscribe(saved => {
      if (saved) {
        this.snackBar.open('Patient registered successfully!', 'Close', { duration: 3000, panelClass: 'snack-success' });
        this.loadPatients();
      }
    });
  }
}