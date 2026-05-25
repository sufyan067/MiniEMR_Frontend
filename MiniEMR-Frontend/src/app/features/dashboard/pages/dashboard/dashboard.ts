import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { AppointmentEventService } from '../../../../core/services/appointment-event.service';
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
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private appointmentEvent = inject(AppointmentEventService);
  authState = inject(AuthState);
  summary = signal<any>(null);
  appointments = signal<any[]>([]);
  todayDoctorAppointments = signal<any[]>([]);
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
    if (this.isDoctor()) {
      this.loadTodayDoctorAppointments();
    }
    this.appointmentEvent.bookingCompleted$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadSummary();
        this.loadAppointments();
        if (this.isDoctor()) this.loadTodayDoctorAppointments();
      });
  }

  private loadTodayDoctorAppointments(): void {
    const todayStr = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    const doctorId = this.authState.currentUser()?.userId;
    this.dashboardService.getAppointments(todayStr).subscribe(response => {
      const list: any[] = Array.isArray(response) ? response : [];
      this.todayDoctorAppointments.set(
        list.filter(x => x.doctorId === doctorId)
      );
    });
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
        this.snackBar.open('Patient checked in successfully.', 'Close', { duration: 3000, panelClass: 'snack-success' });
        this.loadSummary();
        this.loadAppointments();
        if (this.isDoctor()) this.loadTodayDoctorAppointments();
      });
  }
  cancel(appointmentId: number): void {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: 'Cancel Appointment',
        message: 'Are you sure you want to cancel this appointment? The appointment will remain visible with a Cancelled status.',
        confirmText: 'Yes, Cancel It',
        cancelText: 'Go Back'
      }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.dashboardService.updateAppointmentStatus(appointmentId, 4).subscribe(() => {
        this.snackBar.open('Appointment cancelled.', 'Close', { duration: 3000, panelClass: 'snack-warn' });
        this.loadSummary();
        this.loadAppointments();
        if (this.isDoctor()) this.loadTodayDoctorAppointments();
      });
    });
  }
  startVisit(appointmentId: number): void {
    this.router.navigate(['/visits/start', appointmentId]);
  }
  viewVisit(appointmentId: number): void {
    this.router.navigate(['/visits/view', appointmentId]);
  }
  isMyAppointment(item: any): boolean {
    const uid = this.authState.currentUser()?.userId;
    return uid != null && Number(item.doctorId) === Number(uid);
  }
  canCheckIn(item: any): boolean {
    return this.isReceptionist() || this.isMyAppointment(item);
  }
  canCancel(item: any): boolean {
    return this.isReceptionist() || this.isMyAppointment(item);
  }
  canStartVisit(item: any): boolean {
    return this.isDoctor() && this.isMyAppointment(item) && item.statusText === 'CheckedIn';
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