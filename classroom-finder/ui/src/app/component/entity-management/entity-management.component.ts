import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Professor } from '../../models/professor.model';
import { Subject } from '../../models/subject.model';
import { Classroom } from '../../models/classroom.model';
import { Major } from '../../models/major.model';

@Component({
  selector: 'app-entity-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="entity-management-container">
      <div class="tabs">
        <button 
          *ngFor="let tab of tabs" 
          [class.active]="activeTab === tab"
          (click)="setActiveTab(tab)">
          {{tab}}
        </button>
      </div>

      <div class="content">
        <!-- Classrooms Section -->
        <div *ngIf="activeTab === 'Classrooms'" class="entity-section">
          <div class="header">
            <h3>Manage Classrooms</h3>
            <button class="add-btn" (click)="showAddForm = true">Add Classroom</button>
          </div>

          <div class="add-form" *ngIf="showAddForm">
            <h4>Add New Classroom</h4>
            <form (ngSubmit)="onSubmit('classroom')" #classroomForm="ngForm">
              <div class="form-group">
                <label for="classroomName">Classroom Name</label>
                <input
                  type="text"
                  id="classroomName"
                  name="nomSalle"
                  [(ngModel)]="newEntity.nomSalle"
                  required
                  #nomSalle="ngModel"
                  class="form-control"
                >
              </div>
              <div class="form-actions">
                <button type="button" class="btn-cancel" (click)="cancelAdd()">Cancel</button>
                <button type="submit" class="btn-save" [disabled]="classroomForm.invalid">Save</button>
              </div>
            </form>
          </div>

          <div class="entity-list">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let classroom of classrooms">
                  <td>{{classroom.nomSalle}}</td>
                  <td>
                    <button class="btn-edit" (click)="editEntity(classroom, 'classroom')">Edit</button>
                    <button class="btn-delete" (click)="deleteEntity(classroom.nomSalle, 'classroom')">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Majors Section -->
        <div *ngIf="activeTab === 'Majors'" class="entity-section">
          <div class="header">
            <h3>Manage Majors</h3>
            <button class="add-btn" (click)="showAddForm = true">Add Major</button>
          </div>

          <div class="add-form" *ngIf="showAddForm">
            <h4>Add New Major</h4>
            <form (ngSubmit)="onSubmit('major')" #majorForm="ngForm">
              <div class="form-group">
                <label for="majorName">Major Name</label>
                <input
                  type="text"
                  id="majorName"
                  name="nomFiliere"
                  [(ngModel)]="newEntity.nomFiliere"
                  required
                  #nomFiliere="ngModel"
                  class="form-control"
                >
              </div>
              <div class="form-group">
                <label for="majorEmail">Representative Email</label>
                <input
                  type="email"
                  id="majorEmail"
                  name="email_representant"
                  [(ngModel)]="newEntity.email_representant"
                  required
                  #email="ngModel"
                  class="form-control"
                >
              </div>
              <div class="form-actions">
                <button type="button" class="btn-cancel" (click)="cancelAdd()">Cancel</button>
                <button type="submit" class="btn-save" [disabled]="majorForm.invalid">Save</button>
              </div>
            </form>
          </div>

          <div class="entity-list">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let major of majors">
                  <td>{{major.nomFiliere}}</td>
                  <td>{{major.email_representant}}</td>
                  <td>
                    <button class="btn-edit" (click)="editEntity(major, 'major')">Edit</button>
                    <button class="btn-delete" (click)="deleteEntity(major.idFiliere, 'major')">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Subjects Section -->
        <div *ngIf="activeTab === 'Subjects'" class="entity-section">
          <div class="header">
            <h3>Manage Subjects</h3>
            <button class="add-btn" (click)="showAddForm = true">Add Subject</button>
          </div>

          <div class="add-form" *ngIf="showAddForm">
            <h4>Add New Subject</h4>
            <form (ngSubmit)="onSubmit('subject')" #subjectForm="ngForm">
              <div class="form-group">
                <label for="subjectName">Subject Name</label>
                <input
                  type="text"
                  id="subjectName"
                  name="nomMatiere"
                  [(ngModel)]="newEntity.nomMatiere"
                  required
                  #nomMatiere="ngModel"
                  class="form-control"
                >
              </div>
              <div class="form-actions">
                <button type="button" class="btn-cancel" (click)="cancelAdd()">Cancel</button>
                <button type="submit" class="btn-save" [disabled]="subjectForm.invalid">Save</button>
              </div>
            </form>
          </div>

          <div class="entity-list">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let subject of subjects">
                  <td>{{subject.nomMatiere}}</td>
                  <td>
                    <button class="btn-edit" (click)="editEntity(subject, 'subject')">Edit</button>
                    <button class="btn-delete" (click)="deleteEntity(subject.id, 'subject')">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .entity-management-container {
      padding: 20px;
    }

    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .tabs button {
      padding: 10px 20px;
      border: none;
      background-color: #f5f5f5;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .tabs button.active {
      background-color: #2196F3;
      color: white;
    }

    .entity-section {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
      position: relative;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      position: relative;
    }

    .header h3 {
      margin: 0;
    }

    .add-btn {
      padding: 8px 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 0;
    }

    .add-form {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 4px;
      margin-bottom: 20px;
      position: absolute;
      top: 100%;
      right: 0;
      width: 300px;
      z-index: 10;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      color: #666;
    }

    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    .btn-cancel {
      padding: 8px 16px;
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-save {
      padding: 8px 16px;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-save:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .entity-list {
      margin-top: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      background-color: #f5f5f5;
      font-weight: 500;
    }

    .btn-edit, .btn-delete {
      padding: 4px 8px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 5px;
    }

    .btn-edit {
      background-color: #2196F3;
      color: white;
    }

    .btn-delete {
      background-color: #dc3545;
      color: white;
    }
  `]
})
export class EntityManagementComponent implements OnInit {
  tabs = ['Classrooms', 'Majors', 'Subjects'];
  activeTab = 'Classrooms';
  showAddForm = false;
  newEntity: any = {};
  classrooms: Classroom[] = [];
  majors: Major[] = [];
  subjects: Subject[] = [];
  isEditing = false;
  currentEditId: any = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.showAddForm = false;
    this.newEntity = {};
    this.isEditing = false;
    this.currentEditId = null;
  }

  loadData(): void {
    this.dataService.getClassrooms().subscribe(data => {
      this.classrooms = data;
    });

    this.dataService.getMajors().subscribe(data => {
      this.majors = data;
    });

    this.dataService.getSubjects().subscribe(data => {
      this.subjects = data;
    });
  }

  onSubmit(type: string): void {
    if (type === 'classroom') {
      if (this.isEditing) {
        this.dataService.updateClassroom(this.currentEditId, this.newEntity.nomSalle).subscribe(() => {
          this.resetForm();
          this.loadData();
        });
      } else {
        this.dataService.createClassroom(this.newEntity).subscribe(() => {
          this.resetForm();
          this.loadData();
        });
      }
    } else if (type === 'major') {
      if (this.isEditing) {
        this.dataService.updateMajor(this.currentEditId, this.newEntity).subscribe(() => {
          this.resetForm();
          this.loadData();
        });
      } else {
        this.dataService.createMajor(this.newEntity).subscribe(() => {
          this.resetForm();
          this.loadData();
        });
      }
    } else if (type === 'subject') {
      if (this.isEditing) {
        this.dataService.updateSubject(this.currentEditId, { nomMatiere: this.newEntity.nomMatiere }).subscribe(() => {
          this.resetForm();
          this.loadData();
        });
      } else {
        this.dataService.createSubject({ nomMatiere: this.newEntity.nomMatiere }).subscribe(() => {
          this.resetForm();
          this.loadData();
        });
      }
    }
  }

  editEntity(entity: any, type: string): void {
    this.showAddForm = true;
    this.isEditing = true;
    if (type === 'classroom') {
      this.currentEditId = entity.nomSalle;
      this.newEntity = { nomSalle: entity.nomSalle };
    } else if (type === 'major') {
      this.currentEditId = entity.idFiliere;
      this.newEntity = { ...entity };
    } else if (type === 'subject') {
      this.currentEditId = entity.id;
      this.newEntity = { nomMatiere: entity.nomMatiere };
    }
  }

  deleteEntity(id: any, type: string): void {
    if (type === 'classroom') {
      this.dataService.deleteClassroom(id).subscribe(() => {
        this.loadData();
      });
    } else if (type === 'major') {
      this.dataService.deleteMajor(id).subscribe(() => {
        this.loadData();
      });
    } else if (type === 'subject') {
      this.dataService.deleteSubject(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  cancelAdd(): void {
    this.showAddForm = false;
    this.newEntity = {};
    this.isEditing = false;
    this.currentEditId = null;
  }

  resetForm(): void {
    this.showAddForm = false;
    this.newEntity = {};
    this.isEditing = false;
    this.currentEditId = null;
  }
} 