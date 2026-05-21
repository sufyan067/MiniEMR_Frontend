import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.css'
})
export class PatientList implements OnInit {
  private patientService = inject(PatientService);
  private router = inject(Router);
  patients = signal<any[]>([]);
  searchText = signal('');
  filteredPatients = computed(() => {
    const patients = this.patients();
    if (!Array.isArray(patients)) {
      return [];
    }
    const search =
      this.searchText().toLowerCase();
    return patients.filter(x =>
      x.fullName.toLowerCase().includes(search) ||
      x.phoneNumber.toLowerCase().includes(search) ||
      x.cnic.toLowerCase().includes(search)
    );
  });
  ngOnInit(): void {
    this.loadPatients();
  }
  private loadPatients(): void {
    this.patientService
      .getPatients()
      .subscribe(response => {
        this.patients.set(response.patients);
      });
  }
  viewPatient(id: number): void {
    this.router.navigate(['/patients', id]);
  }
}