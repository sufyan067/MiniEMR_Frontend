import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VisitService } from '../../services/visit.service';
import { VisitDetailModel } from '../../models/visit.models';
import { VitalRangeDirective } from '../../../../core/directives/vital-range.directive';
import { BmiPipe } from '../../../../core/pipes/bmi.pipe';

@Component({
  selector: 'app-visit-view',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, VitalRangeDirective, BmiPipe],
  templateUrl: './visit-view.html',
  styleUrl: './visit-view.css'
})
export class VisitView implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private visitService = inject(VisitService);

  visit = signal<VisitDetailModel | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('appointmentId'));
    this.visitService.getVisitDetailByAppointmentId(id).subscribe({
      next: (data) => {
        this.visit.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load visit details.');
        this.loading.set(false);
      }
    });
  }

  back(): void {
    this.router.navigate(['/dashboard']);
  }

  frequencyLabel(freq: number): string {
    const map: Record<number, string> = {
      1: 'Once Daily', 2: 'Twice Daily', 3: 'Thrice Daily',
      4: 'Four Times Daily', 5: 'As Needed'
    };
    return map[freq] ?? 'Unknown';
  }
}
