import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Professor } from '../../models/professor.model';
import { DataService, ApiResponse } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmationService } from '../../services/confirmation.service';
import { ToastContainerComponent } from '../toast-container/toast-container.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ToastContainerComponent, ConfirmationDialogComponent],
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
    private fb: FormBuilder,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) {
    this.professorForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
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
        const errorMsg = 'Failed to load professors. Please try again.';
        this.toastService.showError(errorMsg);
        this.errorMessage = errorMsg;
      }
    });
  }

  onSubmit(): void {
    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';
    
    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log('isEditing:', this.isEditing);
    console.log('currentProfessorId:', this.currentProfessorId);
    console.log('Form values:', this.professorForm.value);
    
    // For editing, check if form has at least the required fields (email, names)
    const isFormValidForEdit = this.isEditing && 
      this.professorForm.get('email')?.valid &&
      this.professorForm.get('nomProfesseur')?.valid &&
      this.professorForm.get('prenomProfesseur')?.valid;
    
    if (this.professorForm.valid || isFormValidForEdit) {
      const professorData = {
        email: this.professorForm.get('email')?.value,
        motDePasse: this.professorForm.get('motDePasse')?.value,
        nomProfesseur: this.professorForm.get('nomProfesseur')?.value,
        prenomProfesseur: this.professorForm.get('prenomProfesseur')?.value
      };

      console.log('Raw professor data:', professorData);

      if (this.isEditing && this.currentProfessorId) {
        console.log('=== UPDATE OPERATION ===');
        console.log('currentProfessorId:', this.currentProfessorId);
        console.log('typeof currentProfessorId:', typeof this.currentProfessorId);
        
        // Don't send empty password field
        const updateData = { ...professorData, idProfesseur: this.currentProfessorId };
        if (!updateData.motDePasse || updateData.motDePasse.trim() === '') {
          console.log('Removing empty password field');
          delete updateData.motDePasse; // Remove empty password from update
        }
        
        console.log('Final update data being sent:', updateData);
        console.log('Update URL will be:', `http://localhost:8090/api/professeurs/${this.currentProfessorId}`);
        
        this.dataService.updateProfessor(updateData)
          .subscribe({
            next: (response: ApiResponse) => {
              console.log('Update response received:', response);
              if (response.success) {
                this.toastService.showSuccess(response.message || 'Professor updated successfully! 🎉');
                this.successMessage = response.message;
                setTimeout(() => this.successMessage = '', 3000);
                this.resetForm();
                this.loadProfessors();
              } else {
                this.toastService.showError(response.message || 'Failed to update professor');
                this.errorMessage = response.message;
                setTimeout(() => this.errorMessage = '', 5000);
              }
            },
            error: (error) => {
              console.error('Error updating professor:', error);
              console.error('Error details:', error.error);
              const errorMsg = error.error?.message || 'Failed to update professor. Please try again.';
              this.toastService.showError(errorMsg);
              this.errorMessage = errorMsg;
              setTimeout(() => this.errorMessage = '', 5000);
            }
          });
      } else {
        console.log('=== CREATE OPERATION ===');
        console.log('Creating new professor with data:', professorData);
        
        this.dataService.createProfessor(professorData)
          .subscribe({
            next: (response: ApiResponse) => {
              console.log('Create response received:', response);
              if (response.success) {
                this.toastService.showSuccess(response.message || 'Professor created successfully! 🎉');
                this.successMessage = response.message;
                setTimeout(() => this.successMessage = '', 3000);
                this.resetForm();
                this.loadProfessors();
              } else {
                this.toastService.showError(response.message || 'Failed to create professor');
                this.errorMessage = response.message;
                setTimeout(() => this.errorMessage = '', 5000);
              }
            },
            error: (error) => {
              console.error('Error creating professor:', error);
              const errorMsg = error.error?.message || 'Failed to create professor. Please try again.';
              this.toastService.showError(errorMsg);
              this.errorMessage = errorMsg;
              setTimeout(() => this.errorMessage = '', 5000);
            }
          });
      }
    } else {
      console.log('Form validation failed');
      console.log('Form errors:', this.getFormErrors());
      const errorMsg = 'Please fill in all required fields correctly.';
      this.toastService.showWarning(errorMsg);
      this.errorMessage = errorMsg;
      setTimeout(() => this.errorMessage = '', 5000);
    }
  }

  editProfessor(professor: Professor): void {
    console.log('=== EDIT PROFESSOR ===');
    console.log('Professor object received:', professor);
    console.log('Professor ID:', professor.idProfesseur);
    console.log('Professor ID type:', typeof professor.idProfesseur);
    
    this.isEditing = true;
    this.currentProfessorId = professor.idProfesseur;
    
    console.log('Set currentProfessorId to:', this.currentProfessorId);
    console.log('isEditing set to:', this.isEditing);
    
    this.professorForm.patchValue({
      email: professor.email,
      motDePasse: '', // Don't pre-fill password for security
      nomProfesseur: professor.nomProfesseur,
      prenomProfesseur: professor.prenomProfesseur
    });
    
    console.log('Form patched with values:', this.professorForm.value);
    
    // Make password optional when editing
    this.professorForm.get('motDePasse')?.clearValidators();
    this.professorForm.get('motDePasse')?.updateValueAndValidity();
    
    console.log('Password validators cleared for editing mode');
    
    // Show info toast
    this.toastService.showInfo(`Editing ${professor.nomProfesseur} ${professor.prenomProfesseur}. Leave password empty to keep current password. ✏️`);
  }

  async deleteProfessor(id: number): Promise<void> {
    const professor = this.professors.find(p => p.idProfesseur === id);
    const professorName = professor ? `${professor.nomProfesseur} ${professor.prenomProfesseur}` : 'this professor';
    
    const confirmed = await this.confirmationService.confirm({
      title: 'Delete Professor',
      message: `Are you sure you want to delete ${professorName}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (confirmed) {
      console.log('Deleting professor with ID:', id);
      this.dataService.deleteProfessor(id)
        .subscribe({
          next: (response: ApiResponse) => {
            console.log('Professor deleted successfully');
            if (response.success) {
              this.toastService.showSuccess(response.message || 'Professor deleted successfully! 🗑️');
              this.successMessage = response.message;
              setTimeout(() => this.successMessage = '', 3000);
              this.loadProfessors();
            } else {
              this.toastService.showError(response.message || 'Failed to delete professor');
              this.errorMessage = response.message;
              setTimeout(() => this.errorMessage = '', 5000);
            }
          },
          error: (error) => {
            console.error('Error deleting professor:', error);
            const errorMsg = error.error?.message || 'Failed to delete professor. Please try again.';
            this.toastService.showError(errorMsg);
            this.errorMessage = errorMsg;
            setTimeout(() => this.errorMessage = '', 5000);
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
    
    // Restore password validation when not editing
    this.professorForm.get('motDePasse')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.professorForm.get('motDePasse')?.updateValueAndValidity();
  }

  getFormErrors(): any {
    let formErrors: any = {};
    
    Object.keys(this.professorForm.controls).forEach(key => {
      const controlErrors = this.professorForm.get(key)?.errors;
      if (controlErrors) {
        formErrors[key] = controlErrors;
      }
    });
    
    return formErrors;
  }
} 