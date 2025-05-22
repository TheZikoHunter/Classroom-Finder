import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Professor } from '../../models/professor.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-professor-management',
  templateUrl: './professor-management.component.html',
  styleUrls: ['./professor-management.component.scss']
})
export class ProfessorManagementComponent implements OnInit {
  professorForm: FormGroup;
  professors: Professor[] = [];
  isEditing = false;
  currentProfessorId?: number;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    this.professorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadProfessors();
  }

  loadProfessors(): void {
    this.dataService.getProfessors().subscribe(data => {
      this.professors = data;
    });
  }

  onSubmit(): void {
    if (this.professorForm.valid) {
      const professor: Professor = this.professorForm.value;
      
      if (this.isEditing && this.currentProfessorId) {
        professor.id = this.currentProfessorId;
        this.dataService.updateProfessor(professor).subscribe(() => {
          this.resetForm();
          this.loadProfessors();
        });
      } else {
        this.dataService.addProfessor(professor).subscribe(() => {
          this.resetForm();
          this.loadProfessors();
        });
      }
    }
  }

  editProfessor(professor: Professor): void {
    this.isEditing = true;
    this.currentProfessorId = professor.id;
    this.professorForm.patchValue({
      firstName: professor.firstName,
      lastName: professor.lastName,
      email: professor.email,
      password: professor.password
    });
  }

  deleteProfessor(id?: number): void {
    if (id) {
      this.dataService.deleteProfessor(id).subscribe(() => {
        this.loadProfessors();
      });
    }
  }

  resetForm(): void {
    this.professorForm.reset();
    this.isEditing = false;
    this.currentProfessorId = undefined;
  }
}