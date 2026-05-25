import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { AuthState } from '../../../auth/state/auth.state';
@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.css'
})
export class AppointmentList implements OnInit {

  private dashboardService = inject(DashboardService);
  private router = inject(Router);
  authState = inject(AuthState);
  appointments = signal<any[]>([]);
  searchText = signal('');
  selectedStatus = signal('All');
  filteredAppointments = computed(() => {
    let data =
      this.appointments();
    const search =
      this.searchText().toLowerCase();
    if (search) {
      data = data.filter(x =>
        x.patientName
          .toLowerCase()
          .includes(search) ||
        x.doctorName
          .toLowerCase()
          .includes(search)
      );
    }
    const status =
      this.selectedStatus();
    if (status !== 'All') {
      data = data.filter(
        x => x.statusText === status
      );
    }
    return data;
  });
  ngOnInit(): void {
    this.loadAppointments();
  }
  private loadAppointments(): void {
    this.dashboardService
      .getAppointments()
      .subscribe(response => {
        this.appointments.set(response);
      });
  }
  checkIn(id: number): void {
    this.dashboardService
      .updateAppointmentStatus(id, 2)
      .subscribe(() => {
        this.loadAppointments();
      });
  }
  cancel(id: number): void {
    this.dashboardService
      .updateAppointmentStatus(id, 4)
      .subscribe(() => {
        this.loadAppointments();
      });
  }
  startVisit(id: number): void {
    this.router.navigate(['/visits/start', id]);
  }
  viewVisit(appointmentId: number): void {
    this.router.navigate(['/visits/view', appointmentId]);
  }
  onStatusChange(status: string): void {
    this.selectedStatus.set(status);
  }
  isDoctor(): boolean {
    return this.authState.currentUser()?.role === 'Doctor';
  }
  isReceptionist(): boolean {
    return this.authState.currentUser()?.role === 'Receptionist';
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
}