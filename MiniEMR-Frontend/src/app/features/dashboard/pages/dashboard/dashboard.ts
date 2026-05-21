import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AuthState } from '../../../auth/state/auth.state';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatSelectModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  providers: [provideNativeDateAdapter()]
})
export class Dashboard implements OnInit {
  private router = inject(Router);
  private dashboardService = inject(DashboardService);
  authState = inject(AuthState);
  summary = signal<any>(null);
  appointments = signal<any[]>([]);
  selectedDate = signal<Date | null>(null);
  selectedStatus = signal<string>('All');
  isDoctor(): boolean {
    return this.authState.currentUser()?.role === 'Doctor';
  }
  isReceptionist(): boolean {
    return this.authState.currentUser()?.role === 'Receptionist';
  }
  ngOnInit(): void {
    this.loadSummary();
    this.loadAppointments();
  }
  private loadSummary(): void {
    this.dashboardService
      .getSummary()
      .subscribe(response => {
        this.summary.set(response);
      });
  }
  private loadAppointments(): void {
    let formattedDate: string | undefined;
    if (this.selectedDate()) {
      formattedDate = formatDate(
        this.selectedDate()!,
        'yyyy-MM-dd',
        'en-US'
      );
    }
    let statusValue: string | undefined;
    const selectedStatus = this.selectedStatus();
    if (selectedStatus !== 'All') {
      switch (selectedStatus) {
        case 'Booked':
          statusValue = '1';
          break;
        case 'CheckedIn':
          statusValue = '2';
          break;
        case 'Completed':
          statusValue = '3';
          break;
        case 'Cancelled':
          statusValue = '4';
          break;
      }
    }
    this.dashboardService.getAppointments(formattedDate, statusValue).subscribe(response => { this.appointments.set(response) });
  }
  checkIn(appointmentId: number): void {
    this.dashboardService
      .updateAppointmentStatus(appointmentId, 2)
      .subscribe(() => {
        this.loadSummary();
        this.loadAppointments();
      });
  }
  cancel(appointmentId: number): void {
    this.dashboardService
      .updateAppointmentStatus(appointmentId, 4)
      .subscribe(() => {
        this.loadSummary();
        this.loadAppointments();
      });
  }
  startVisit(appointmentId: number): void {
    this.router.navigate([
      '/visits/start',
      appointmentId
    ]);
  }
  onDateChange(
    event: MatDatepickerInputEvent<Date>
  ): void {
    this.selectedDate.set(event.value ?? null);
    this.loadAppointments();
  }

  onStatusChange(status: string): void {

    this.selectedStatus.set(status);

    this.loadAppointments();
  }
}