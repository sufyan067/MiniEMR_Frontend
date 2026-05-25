import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as VisitActions from '../../store/actions/visit.actions';
import { VisitService } from '../../services/visit.service';
import { MedicineModel, PrescribedMedicineRequest } from '../../models/visit.models';
@Component({
  selector: 'app-prescription-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './prescription-section.html',
  styleUrl: './prescription-section.css'
})
export class PrescriptionSection implements OnInit {

  private fb = inject(FormBuilder);

  private store = inject(Store);

  private visitService = inject(VisitService);

  medicines = signal<MedicineModel[]>([]);

  prescriptionsForm = this.fb.group({
    medicines: this.fb.array([])
  });

  get medicinesArray(): FormArray {
    return this.prescriptionsForm
      .get('medicines') as FormArray;
  }
  ngOnInit(): void {
    this.loadMedicines();
    this.prescriptionsForm.valueChanges
      .pipe(
        debounceTime(300)
      )
      .subscribe(value => {
        this.store.dispatch(
          VisitActions.updatePrescriptions({
            prescribedMedicines: (value.medicines ?? []) as PrescribedMedicineRequest[]
          })
        );
      });
  }
  private loadMedicines(): void {
    this.visitService
      .getMedicines()
      .subscribe(response => {
        this.medicines.set(response);
        this.addMedicine();
      });
  }
  addMedicine(): void {
    this.medicinesArray.push(
      this.fb.nonNullable.group({
        medicineId: [0, Validators.required],
        dosage: ['', [Validators.required, Validators.maxLength(50)]],
        frequency: [1, Validators.required],
        duration: ['', [Validators.required, Validators.maxLength(50)]],
        instructions: ['', Validators.maxLength(200)]
      })
    );
  }
  removeMedicine(index: number): void {
    this.medicinesArray.removeAt(index);
  }
}