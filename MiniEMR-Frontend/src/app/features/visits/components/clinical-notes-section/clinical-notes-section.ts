import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';
import * as VisitActions from '../../store/actions/visit.actions';
import * as VisitSelectors from '../../store/selectors/visit.selectors';
@Component({
  selector: 'app-clinical-notes-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './clinical-notes-section.html',
  styleUrl: './clinical-notes-section.css'
})
export class ClinicalNotesSection
  implements OnInit {
  private fb = inject(FormBuilder);

  private store = inject(Store);

  form = this.fb.nonNullable.group({

    chiefComplaint: ['', Validators.required],

    visitNote: ['', Validators.required],

    diagnosis: ['', Validators.required]
  });
  ngOnInit(): void {
    this.store.select(
      VisitSelectors.selectClinicalNotes
    ).subscribe(data => {
      this.form.patchValue(data, {
        emitEvent: false
      });
    });
    this.form.valueChanges
      .pipe(
        debounceTime(300)
      )
      .subscribe(value => {
        this.store.dispatch(
          VisitActions
            .updateClinicalNotes({
              chiefComplaint:
                value.chiefComplaint ?? '',
              visitNote:
                value.visitNote ?? '',
              diagnosis:
                value.diagnosis ?? ''
            })
        );
      });
  }
}