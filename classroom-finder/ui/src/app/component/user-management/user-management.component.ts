import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Professor } from '../../models/professor.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html'
})
export class UserManagementComponent implements OnInit {
  professors: Professor[] = [];
  professorForm: FormGroup;
  isEditing = false;
  currentProfessorId?: number;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) {
    this.professorForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      mot_de_passe: ['', [Validators.required, Validators.minLength(6)]],
      nomProfesseur: ['', Validators.required],
      prenomProfesseur: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProfessors();
  }

  loadProfessors(): void {
    console.log('Loading professors...');
    this.dataService.getProfessors().subscribe({
      next: (professors) => {
        console.log('Professors loaded:', professors);
        this.professors = professors;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error loading professors:', error);
        this.errorMessage = 'Failed to load professors. Please try again.';
      }
    });
  }

  onSubmit(): void {
    if (this.professorForm.valid) {
      const professorData = {
        email: this.professorForm.get('email')?.value,
        mot_de_passe: this.professorForm.get('mot_de_passe')?.value,
        nomProfesseur: this.professorForm.get('nomProfesseur')?.value,
        prenomProfesseur: this.professorForm.get('prenomProfesseur')?.value
      };

      console.log('Submitting professor data:', professorData);

      if (this.isEditing && this.currentProfessorId) {
        this.dataService.updateProfessor({ ...professorData, id_professeur: this.currentProfessorId })
          .subscribe({
            next: () => {
              console.log('Professor updated successfully');
              this.successMessage = 'Professor updated successfully';
              this.resetForm();
              this.loadProfessors();
            },
            error: (error) => {
              console.error('Error updating professor:', error);
              this.errorMessage = 'Failed to update professor. Please try again.';
            }
          });
      } else {
        this.dataService.createProfessor(professorData)
          .subscribe({
            next: () => {
              console.log('Professor created successfully');
              this.successMessage = 'Professor created successfully';
              this.resetForm();
              this.loadProfessors();
            },
            error: (error) => {
              console.error('Error creating professor:', error);
              this.errorMessage = 'Failed to create professor. Please try again.';
            }
          });
      }
    }
  }

  editProfessor(professor: Professor): void {
    console.log('Editing professor:', professor);
    this.isEditing = true;
    this.currentProfessorId = professor.id_professeur;
    this.professorForm.patchValue({
      email: professor.email,
      mot_de_passe: professor.mot_de_passe,
      nomProfesseur: professor.nomProfesseur,
      prenomProfesseur: professor.prenomProfesseur
    });
  }

  deleteProfessor(id: number): void {
    if (confirm('Are you sure you want to delete this professor?')) {
      console.log('Deleting professor with ID:', id);
      this.dataService.deleteProfessor(id)
        .subscribe({
          next: () => {
            console.log('Professor deleted successfully');
            this.successMessage = 'Professor deleted successfully';
            this.loadProfessors();
          },
          error: (error) => {
            console.error('Error deleting professor:', error);
            this.errorMessage = 'Failed to delete professor. Please try again.';
          }
        });
    }
  }

  resetForm(): void {
    this.professorForm.reset();
    this.isEditing = false;
    this.currentProfessorId = undefined;
    this.errorMessage = '';
    this.successMessage = '';
  }
} 