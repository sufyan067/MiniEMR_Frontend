import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppointmentEventService {
  private _bookingCompleted = new Subject<void>();
  bookingCompleted$ = this._bookingCompleted.asObservable();

  notifyBookingCompleted(): void {
    this._bookingCompleted.next();
  }
}
