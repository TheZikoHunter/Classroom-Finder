import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProfesseurService, Professeur, ApiResponse } from '../../services/professeur.service';

@Component({
  selector: 'app-professor-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="professor-management">
      <h2>Manage Professors</h2>
      
      <!-- Success/Error Messages -->
      <div class="alert alert-success" *ngIf="successMessage">
        {{ successMessage }}
      </div>
      <div class="alert alert-danger" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>
      
      <!-- Add Professor Form -->
      <div class="add-professor-form">
        <h3>{{ isEditing ? 'Edit Professor' : 'Add New Professor' }}</h3>
        <form (ngSubmit)="isEditing ? updateProfesseur() : addProfesseur()" #professorForm="ngForm">
          <div class="form-group">
            <label>First Name:</label>
            <input type="text" [(ngModel)]="newProfesseur.prenomProfesseur" 
                   name="prenom" required class="form-control">
          </div>
          
          <div class="form-group">
            <label>Last Name:</label>
            <input type="text" [(ngModel)]="newProfesseur.nomProfesseur" 
                   name="nom" required class="form-control">
          </div>
          
          <div class="form-group">
            <label>Email:</label>
            <input type="email" [(ngModel)]="newProfesseur.email" 
                   name="email" required class="form-control">
          </div>
          
          <div class="form-group">
            <label>Password:</label>
            <input type="password" [(ngModel)]="newProfesseur.motDePasse" 
                   name="motDePasse" 
                   [required]="!isEditing" 
                   class="form-control"
                   [placeholder]="isEditing ? 'Leave empty to keep current password' : 'Enter password'">
            <small *ngIf="isEditing" class="text-muted">Leave empty to keep current password</small>
          </div>
          
          <div class="form-actions">
            <button type="submit" [disabled]="professorForm.invalid || isLoading" 
                    class="btn btn-primary">
              {{ isLoading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Professor' : 'Add Professor') }}
            </button>
            <button type="button" *ngIf="isEditing" (click)="cancelEdit()" 
                    class="btn btn-secondary" [disabled]="isLoading">
              Cancel
            </button>
          </div>
        </form>
      </div>
      
      <!-- Professors List -->
      <div class="professors-list">
        <h3>Professors List</h3>
        <div class="loading" *ngIf="loadingProfessors">Loading professors...</div>
        
        <table class="table" *ngIf="!loadingProfessors">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let prof of professeurs">
              <td>{{ prof.idProfesseur }}</td>
              <td>{{ prof.prenomProfesseur }} {{ prof.nomProfesseur }}</td>
              <td>{{ prof.email }}</td>
              <td>
                <button (click)="editProfesseur(prof)" class="btn btn-sm btn-warning">Edit</button>
                <button (click)="deleteProfesseur(prof.idProfesseur!)" class="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .professor-management {
      padding: 20px;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 5px;
    }
    
    .btn-primary { background-color: #007bff; color: white; }
    .btn-secondary { background-color: #6c757d; color: white; }
    .btn-warning { background-color: #ffc107; color: black; }
    .btn-danger { background-color: #dc3545; color: white; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    
    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }
    
    .alert {
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
    }
    .alert-success { background-color: #d4edda; color: #155724; }
    .alert-danger { background-color: #f8d7da; color: #721c24; }
    
    .table {
      width: 100%;
      border-collapse: collapse;
    }
    .table th, .table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    .table th {
      background-color: #f2f2f2;
    }
  `]
})
export class ProfessorManagementComponent implements OnInit {
  professeurs: Professeur[] = [];
  newProfesseur: Professeur = {
    email: '',
    motDePasse: '',
    nomProfesseur: '',
    prenomProfesseur: ''
  };
  
  // Add missing properties for edit functionality
  editingProfesseur: Professeur | null = null;
  isEditing: boolean = false;
  
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  loadingProfessors: boolean = false;

  constructor(private professeurService: ProfesseurService) {}

  ngOnInit() {
    this.loadProfesseurs();
  }

  loadProfesseurs() {
    this.loadingProfessors = true;
    this.professeurService.getAllProfesseurs().subscribe({
      next: (professeurs) => {
        this.professeurs = professeurs;
        this.loadingProfessors = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading professors';
        this.loadingProfessors = false;
        console.error('Error:', error);
      }
    });
  }

  addProfesseur() {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.professeurService.createProfesseur(this.newProfesseur).subscribe({
      next: (response: ApiResponse) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = response.message;
          this.resetForm();
          this.loadProfesseurs(); // Refresh the list
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error creating professor';
        console.error('Error:', error);
      }
    });
  }

  editProfesseur(professeur: Professeur) {
    this.editingProfesseur = { ...professeur }; // Store the original professor
    this.isEditing = true;
    this.newProfesseur = {
      idProfesseur: professeur.idProfesseur, // Make sure ID is included
      email: professeur.email,
      motDePasse: '', // Don't pre-fill password for security
      nomProfesseur: professeur.nomProfesseur,
      prenomProfesseur: professeur.prenomProfesseur
    };
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Complete the updateProfesseur method:
updateProfesseur() {
  console.log('=== UPDATE DEBUG ===');
  console.log('editingProfesseur:', this.editingProfesseur);
  console.log('newProfesseur:', this.newProfesseur);
  console.log('ID from editingProfesseur:', this.editingProfesseur?.idProfesseur);
  console.log('====================');

  if (!this.editingProfesseur?.idProfesseur) {
    this.errorMessage = 'Professor ID is required for update';
    return;
  }

  this.isLoading = true;
  this.successMessage = '';
  this.errorMessage = '';

  console.log('Updating professor with ID:', this.editingProfesseur.idProfesseur);
  console.log('Update data:', this.newProfesseur);

  // Use the editingProfesseur's ID, not newProfesseur's ID
  this.professeurService.updateProfesseur(this.editingProfesseur.idProfesseur, this.newProfesseur).subscribe({
    next: (response: ApiResponse) => {
      this.isLoading = false;
      if (response.success) {
        this.successMessage = response.message;
        this.cancelEdit();
        this.loadProfesseurs();
      } else {
        this.errorMessage = response.message;
      }
    },
    error: (error) => {
      this.isLoading = false;
      this.errorMessage = error.error?.message || 'Error updating professor';
      console.error('Error:', error);
    }
  });
}

// Make sure cancelEdit() method exists:
cancelEdit() {
  this.isEditing = false;
  this.editingProfesseur = null;
  this.resetForm();
  this.successMessage = '';
  this.errorMessage = '';
}

  deleteProfesseur(id: number) {
    if (confirm('Are you sure you want to delete this professor?')) {
      this.professeurService.deleteProfesseur(id).subscribe({
        next: (response: ApiResponse) => {
          if (response.success) {
            this.successMessage = response.message;
            this.loadProfesseurs(); // Refresh the list
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.errorMessage = 'Error deleting professor';
          console.error('Error:', error);
        }
      });
    }
  }

  resetForm() {
    this.newProfesseur = {
      email: '',
      motDePasse: '',
      nomProfesseur: '',
      prenomProfesseur: ''
    };
    this.editingProfesseur = null;
    this.isEditing = false;
  }
}