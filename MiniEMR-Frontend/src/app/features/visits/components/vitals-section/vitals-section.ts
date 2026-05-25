import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';
import * as VisitActions from '../../store/actions/visit.actions';
import * as VisitSelectors from '../../store/selectors/visit.selectors';
import { VitalModel } from '../../models/visit.models';
import { VitalRangeDirective, VITAL_RANGES } from '../../../../core/directives/vital-range.directive';
import { BmiPipe } from '../../../../core/pipes/bmi.pipe';

@Component({
  selector: 'app-vitals-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, VitalRangeDirective, BmiPipe],
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

  ngOnInit(): void {
    this.store.select(VisitSelectors.selectVitals).subscribe(data => {
      if (data) {
        this.form.patchValue(data, { emitEvent: false });
        if (data.bMI) {
          this.form.get('bMI')!.setValue(data.bMI, { emitEvent: false });
        } else {
          this.recalculateBMI(data.heightCm, data.weightKg);
        }
      }
    });

    this.form.get('heightCm')!.valueChanges.subscribe(h => {
      this.recalculateBMI(h, this.form.get('weightKg')!.value);
    });

    this.form.get('weightKg')!.valueChanges.subscribe(w => {
      this.recalculateBMI(this.form.get('heightCm')!.value, w);
    });

    this.form.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.dispatchVitals();
    });
  }

  rangeLabel(field: string): string {
    return VITAL_RANGES[field]?.label ?? '';
  }

  private recalculateBMI(h: number | null | undefined, w: number | null | undefined): void {
    if (h && w && h > 0) {
      const bmi = Math.round((w / ((h / 100) ** 2)) * 10) / 10;
      this.form.get('bMI')!.setValue(bmi, { emitEvent: false });
    } else {
      this.form.get('bMI')!.setValue(null, { emitEvent: false });
    }
  }

  private dispatchVitals(): void {
    this.store.dispatch(
      VisitActions.updateVitals({ vital: this.form.getRawValue() as VitalModel })
    );
  }
}