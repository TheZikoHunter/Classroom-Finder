import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Classroom } from '../../models/classroom.model';
import { DataService } from '../../services/data.service';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-classroom-management',
  templateUrl: './classroom-management.component.html',
  styleUrls: ['./classroom-management.component.scss']
})
export class ClassroomManagementComponent implements OnInit {
  classroomForm: FormGroup;
  classrooms: Classroom[] = [];
  isEditing = false;
  currentClassroomId?: string;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    this.classroomForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadClassrooms();
  }

  loadClassrooms(): void {
    this.dataService.getClassrooms().subscribe(data => {
      this.classrooms = data;
    });
  }

  onSubmit(): void {
    if (this.classroomForm.valid) {
      const classroom: Classroom = this.classroomForm.value;
      
      if (this.isEditing && this.currentClassroomId) {
        const oldNomSalle = this.currentClassroomId.toString();
        const newNomSalle = classroom.nomSalle;
        this.dataService.updateClassroom(oldNomSalle, newNomSalle).subscribe(() => {
          this.resetForm();
          this.loadClassrooms();
        });
      } else {
        this.dataService.createClassroom(classroom).subscribe(() => {
          this.resetForm();
          this.loadClassrooms();
        });
      }
    }
  }

  editClassroom(classroom: Classroom): void {
    this.isEditing = true;
    this.currentClassroomId = classroom.nomSalle;
    this.classroomForm.patchValue({
      name: classroom.nomSalle
    });
  }

  deleteClassroom(nomSalle: string): void {
    if (nomSalle) {
      this.dataService.deleteClassroom(nomSalle).subscribe(() => {
        this.loadClassrooms();
      });
    }
  }

  resetForm(): void {
    this.classroomForm.reset();
    this.isEditing = false;
    this.currentClassroomId = undefined;
  }
}