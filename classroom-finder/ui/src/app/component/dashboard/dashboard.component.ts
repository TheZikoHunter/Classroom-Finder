import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { Professor } from '../../models/professor.model';
import { Subject } from '../../models/subject.model';
import { Classroom } from '../../models/classroom.model';
import { Major } from '../../models/major.model';
import { TimeSlot } from '../../models/time-slot.model';
import { AssignmentDialogComponent } from '../assignment-dialog/assignment-dialog.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { AuthService } from '../../services/auth.service';
import { EntityManagementComponent } from '../entity-management/entity-management.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    AssignmentDialogComponent,
    UserManagementComponent,
    EntityManagementComponent
  ],
  template: `
    <div class="dashboard-layout">
      <nav class="sidebar">
        <div class="logo">Classroom Finder</div>
        <ul class="nav-links">
          <li [class.active]="activePanel === 'timetable'" (click)="setActivePanel('timetable')">
            Timetable
          </li>
          <li [class.active]="activePanel === 'users'" (click)="setActivePanel('users')">
            User Management
          </li>
          <li [class.active]="activePanel === 'entities'" (click)="setActivePanel('entities')">
            Entity Management
          </li>
        </ul>
        <div class="user-info">
          <span>{{currentUser?.username}}</span>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      </nav>

      <main class="main-content">
        <div *ngIf="activePanel === 'timetable'" class="timetable-panel">
          <div class="header">
            <h1>Timetable Management</h1>
            <div class="controls">
              <select class="major-select" (change)="onMajorChange($event)">
                <option value="">Select Major</option>
                <option *ngFor="let major of majors" [value]="major.idFiliere">{{major.nomFiliere}}</option>
              </select>
              <button class="save-btn" (click)="saveTimetable()">Save Timetable</button>
            </div>
          </div>

          <div class="days-selector">
            <button 
              *ngFor="let day of days" 
              class="day-btn" 
              [class.active]="selectedDay === day"
              (click)="onDayChange(day)">
              {{day}}
            </button>
          </div>

          <div class="timetable">
            <div class="time-slots">
              <div *ngFor="let slot of timeSlots" class="time-slot">
                <div class="time-range">
                  {{slot.startTime}} - {{slot.endTime}}
                </div>
                <div class="slot-details">
                  <div class="subject">{{slot.subject?.nomMatiere || 'No subject assigned'}}</div>
                  <div class="professor">{{slot.professor?.nomProfesseur || 'No professor assigned'}}</div>
                  <div class="classroom">{{slot.classroom?.nomSalle || 'No classroom assigned'}}</div>
                </div>
                <div class="slot-actions">
                  <button class="assign-btn" (click)="assignTimeSlot(slot)">Assign</button>
                </div>
              </div>
            </div>
          </div>

          <app-assignment-dialog
            *ngIf="showAssignmentDialog && selectedTimeSlot"
            [timeSlot]="selectedTimeSlot"
            [subjects]="subjects"
            [professors]="professors"
            [classrooms]="classrooms"
            (save)="onAssignmentSave($event)"
            (cancel)="onAssignmentCancel()">
          </app-assignment-dialog>
        </div>

        <app-user-management *ngIf="activePanel === 'users'"></app-user-management>
        
        <app-entity-management *ngIf="activePanel === 'entities'"></app-entity-management>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 250px;
      background-color: #2c3e50;
      color: white;
      padding: 20px;
      display: flex;
      flex-direction: column;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 30px;
      padding: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .nav-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-links li {
      padding: 12px 15px;
      cursor: pointer;
      border-radius: 4px;
      margin-bottom: 5px;
      transition: background-color 0.2s;
    }

    .nav-links li:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-links li.active {
      background-color: #3498db;
    }

    .user-info {
      margin-top: auto;
      padding: 15px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .logout-btn {
      padding: 8px;
      background-color: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .main-content {
      flex: 1;
      padding: 20px;
      background-color: #f5f5f5;
    }

    /* Existing styles for timetable panel */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .controls {
      display: flex;
      gap: 10px;
    }

    .major-select {
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ddd;
      min-width: 200px;
    }

    .save-btn {
      padding: 8px 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .days-selector {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .day-btn {
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
      cursor: pointer;
    }

    .day-btn.active {
      background-color: #2196F3;
      color: white;
      border-color: #2196F3;
    }

    .timetable {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }

    .time-slots {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .time-slot {
      display: flex;
      align-items: center;
      padding: 15px;
      border: 1px solid #eee;
      border-radius: 4px;
    }

    .time-range {
      min-width: 150px;
      font-weight: 500;
    }

    .slot-details {
      flex: 1;
      display: flex;
      gap: 20px;
    }

    .assign-btn {
      padding: 6px 12px;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class DashboardComponent implements OnInit {
  classrooms: Classroom[] = [];
  majors: Major[] = [];
  professors: Professor[] = [];
  subjects: Subject[] = [];
  classroomFilter: { value: string; label: string; }[] = [];
  majorFilter: { value: number; label: string; }[] = [];
  professorFilter: { value: number; label: string; }[] = [];
  subjectFilter: { value: number; label: string; }[] = [];
  
  selectedMajor: Major | null = null;
  selectedDay: string = 'Monday';
  timeSlots: TimeSlot[] = [];
  showAssignmentDialog = false;
  selectedTimeSlot: TimeSlot | null = null;
  activePanel: 'timetable' | 'users' | 'entities' = 'timetable';
  currentUser: any;
  
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  timeRanges = [
    { start: '08:30', end: '10:30' },
    { start: '10:30', end: '12:30' },
    { start: '14:00', end: '16:00' },
    { start: '16:00', end: '18:00' }
  ];

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadData();
    this.initializeTimeSlots();
  }

  setActivePanel(panel: 'timetable' | 'users' | 'entities'): void {
    this.activePanel = panel;
    if (panel === 'timetable') {
      this.loadData();
    }
  }

  logout(): void {
    this.authService.logout();
  }

  loadData(): void {
    this.dataService.getClassrooms().subscribe(data => {
      this.classrooms = data;
      this.updateClassroomFilter();
    });

    this.dataService.getMajors().subscribe(data => {
      this.majors = data;
      this.updateMajorFilter();
    });

    this.dataService.getProfessors().subscribe(data => {
      this.professors = data;
      this.updateProfessorFilter();
    });

    this.dataService.getSubjects().subscribe(data => {
      this.subjects = data;
      this.updateSubjectFilter();
    });
  }

  updateMajorFilter(): void {
    this.majorFilter = this.majors.map(major => ({
      value: major.idFiliere,
      label: major.nomFiliere
    }));
  }

  initializeTimeSlots(): void {
    this.timeSlots = this.timeRanges.map(range => ({
      day: this.selectedDay,
      startTime: range.start,
      endTime: range.end,
      subject: null,
      professor: null,
      classroom: null
    }));
  }

  onDayChange(day: string): void {
    this.selectedDay = day;
    this.initializeTimeSlots();
  }

  onMajorChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const majorId = parseInt(select.value);
    this.selectedMajor = this.majors.find(m => m.idFiliere === majorId) || null;
  }

  assignTimeSlot(slot: TimeSlot): void {
    this.selectedTimeSlot = slot;
    this.showAssignmentDialog = true;
  }

  onAssignmentSave(updatedSlot: TimeSlot): void {
    const index = this.timeSlots.findIndex(slot => 
      slot.day === updatedSlot.day && 
      slot.startTime === updatedSlot.startTime && 
      slot.endTime === updatedSlot.endTime
    );
    
    if (index !== -1) {
      this.timeSlots[index] = updatedSlot;
    }
    
    this.showAssignmentDialog = false;
    this.selectedTimeSlot = null;
    this.loadData();
  }

  onAssignmentCancel(): void {
    this.showAssignmentDialog = false;
    this.selectedTimeSlot = null;
    this.loadData();
  }

  saveTimetable(): void {
    console.log('Saving timetable:', this.timeSlots);
  }

  updateClassroomFilter(): void {
    this.classroomFilter = this.classrooms.map(classroom => ({
      value: classroom.nomSalle,
      label: classroom.nomSalle
    }));
  }

  updateProfessorFilter(): void {
    this.professorFilter = this.professors.map(professor => ({
      value: professor.id_professeur,
      label: professor.nomProfesseur + ' ' + professor.prenomProfesseur
    }));
  }

  updateSubjectFilter(): void {
    this.subjectFilter = this.subjects.map(subject => ({
      value: subject.idMatiere,
      label: subject.nomMatiere
    }));
  }
} 