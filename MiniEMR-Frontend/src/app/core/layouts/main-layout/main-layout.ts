import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthState } from '../../../features/auth/state/auth.state';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { AppointmentDialog } from '../../../features/appointments/components/appointment-dialog/appointment-dialog';
import { AppointmentEventService } from '../../services/appointment-event.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterLinkActive
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {
  authState = inject(AuthState);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private appointmentEvent = inject(AppointmentEventService);

  isReceptionist(): boolean {
    return this.authState.currentUser()?.role === 'Receptionist';
  }

  isDoctor(): boolean {
    return this.authState.currentUser()?.role === 'Doctor';
  }

  canBookAppointment(): boolean {
    return this.isReceptionist() || this.isDoctor();
  }

  openBookDialog(): void {
    const user = this.authState.currentUser();
    const dialogData = this.isDoctor()
      ? { doctorId: user?.userId, doctorName: user?.fullName }
      : {};
    const ref = this.dialog.open(AppointmentDialog, {
      width: '620px',
      disableClose: true,
      data: dialogData
    });
    ref.afterClosed().subscribe(saved => {
      if (saved) {
        this.snackBar.open('Appointment booked successfully!', 'Close', { duration: 3000, panelClass: 'snack-success' });
        this.appointmentEvent.notifyBookingCompleted();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}