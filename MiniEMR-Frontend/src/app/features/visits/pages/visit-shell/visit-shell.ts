import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClinicalNotesSection } from '../../components/clinical-notes-section/clinical-notes-section';
import { VitalsSection } from '../../components/vitals-section/vitals-section';
import { PrescriptionSection } from '../../components/prescription-section/prescription-section';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import * as VisitActions from '../../store/actions/visit.actions';
import * as VisitSelectors from '../../store/selectors/visit.selectors';
import { VisitService } from '../../services/visit.service';

@Component({
  selector: 'app-visit-shell',
  standalone: true,
  imports: [CommonModule, ClinicalNotesSection, VitalsSection, PrescriptionSection, MatButtonModule, MatIconModule],
  templateUrl: './visit-shell.html',
  styleUrl: './visit-shell.css',
})
export class VisitShell implements OnInit, OnDestroy {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private visitService = inject(VisitService);

  appointmentId = signal(0);
  currentStep = signal(1);

  visitStart = toSignal(this.store.select(VisitSelectors.selectVisitStart));
  loading = toSignal(this.store.select(VisitSelectors.selectVisitLoading), { initialValue: false });
  error = toSignal(this.store.select(VisitSelectors.selectVisitError));

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('appointmentId'));
    this.appointmentId.set(id);

    this.visitService.getVisitStartData(id).subscribe(data => {
      this.store.dispatch(VisitActions.loadVisitStart({ visitStart: data }));
    });
  }

  goToStep(n: number): void {
    this.currentStep.set(n);
  }

  saveVisit(): void {
    this.store.dispatch(VisitActions.saveVisit({ appointmentId: this.appointmentId() }));
  }

  discard(): void {
    this.store.dispatch(VisitActions.resetVisit());
    this.router.navigate(['/appointments']);
  }

  ngOnDestroy(): void {
    this.store.dispatch(VisitActions.resetVisit());
  }
}
