import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';
import * as VisitActions from '../../store/actions/visit.actions';
import * as VisitSelectors from '../../store/selectors/visit.selectors';
import { VitalModel } from '../../models/visit.models';

type VitalStatus = 'normal' | 'abnormal' | null;

const RANGES: Record<string, { min: number; max: number; label: string }> = {
  bPSystolic:      { min: 90,   max: 140,  label: '90–140' },
  bPDiastolic:     { min: 60,   max: 90,   label: '60–90' },
  pulseRate:       { min: 60,   max: 100,  label: '60–100' },
  temperatureF:    { min: 97.0, max: 99.0, label: '97–99°F' },
  respiratoryRate: { min: 12,   max: 20,   label: '12–20' },
  bMI:             { min: 18.5, max: 24.9, label: '18.5–24.9' }
};

@Component({
  selector: 'app-vitals-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vitals-section.html',
  styleUrl: './vitals-section.css'
})
export class VitalsSection implements OnInit {

  private fb = inject(FormBuilder);
  private store = inject(Store);

  form = this.fb.group({
    heightCm:        [null as number | null, [Validators.min(30),  Validators.max(250)]],
    weightKg:        [null as number | null, [Validators.min(1),   Validators.max(500)]],
    bMI:             [{ value: null as number | null, disabled: true }],
    bPSystolic:      [null as number | null, [Validators.min(60),  Validators.max(300)]],
    bPDiastolic:     [null as number | null, [Validators.min(30),  Validators.max(200)]],
    pulseRate:       [null as number | null, [Validators.min(20),  Validators.max(300)]],
    temperatureF:    [null as number | null, [Validators.min(85),  Validators.max(115)]],
    respiratoryRate: [null as number | null, [Validators.min(4),   Validators.max(60)]]
  });

  statuses = signal<Record<string, VitalStatus>>({});

  ngOnInit(): void {
    this.store.select(VisitSelectors.selectVitals).subscribe(data => {
      if (data) {
        this.form.patchValue(data, { emitEvent: false });
        if (data.bMI) {
          this.form.get('bMI')!.setValue(data.bMI, { emitEvent: false });
        } else {
          this.recalculateBMI(data.heightCm, data.weightKg);
        }
        this.updateStatuses();
      }
    });

    this.form.get('heightCm')!.valueChanges.subscribe(h => {
      this.recalculateBMI(h, this.form.get('weightKg')!.value);
    });

    this.form.get('weightKg')!.valueChanges.subscribe(w => {
      this.recalculateBMI(this.form.get('heightCm')!.value, w);
    });

    this.form.valueChanges.pipe(debounceTime(80)).subscribe(() => {
      this.updateStatuses();
    });

    this.form.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.dispatchVitals();
    });
  }

  statusOf(field: string): VitalStatus {
    return this.statuses()[field] ?? null;
  }

  rangeLabel(field: string): string {
    return RANGES[field]?.label ?? '';
  }

  private recalculateBMI(h: number | null | undefined, w: number | null | undefined): void {
    if (h && w && h > 0) {
      const bmi = Math.round((w / ((h / 100) ** 2)) * 10) / 10;
      this.form.get('bMI')!.setValue(bmi, { emitEvent: false });
    } else {
      this.form.get('bMI')!.setValue(null, { emitEvent: false });
    }
    this.updateStatuses();
  }

  private updateStatuses(): void {
    const raw = this.form.getRawValue() as Record<string, number | null>;
    const updated: Record<string, VitalStatus> = {};
    for (const field of Object.keys(RANGES)) {
      const v = raw[field];
      if (v === null || v === undefined) {
        updated[field] = null;
      } else {
        const r = RANGES[field];
        updated[field] = v >= r.min && v <= r.max ? 'normal' : 'abnormal';
      }
    }
    this.statuses.set(updated);
  }

  private dispatchVitals(): void {
    this.store.dispatch(
      VisitActions.updateVitals({ vital: this.form.getRawValue() as VitalModel })
    );
  }
}