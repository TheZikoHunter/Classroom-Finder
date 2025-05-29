import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
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

          <div class="timetable">
            <table class="timetable-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th *ngFor="let day of days">{{day}}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let range of timeRanges">
                  <td class="time-cell">{{range.start}} - {{range.end}}</td>
                  <td *ngFor="let day of days"
                      class="slot-cell"
                      [class.planning-slot]="getTimeSlot(day, range)?.type === 'planning'"
                      [class.reservation-slot]="getTimeSlot(day, range)?.type === 'reservation'"
                      (click)="assignTimeSlot(getTimeSlot(day, range))">
                    <ng-container *ngIf="getTimeSlot(day, range) as slot">
                      <div *ngIf="slot.subject || slot.professor || slot.classroom" class="slot-content">
                        <div *ngIf="slot.subject" class="subject">{{slot.subject.nomMatiere}}</div>
                        <div *ngIf="slot.professor" class="professor">{{slot.professor.nomProfesseur}}</div>
                        <div *ngIf="slot.classroom" class="classroom">{{slot.classroom.nomSalle}}</div>
                        <button *ngIf="slot.type && (slot.idPlanning || slot.idReservation)" class="delete-btn" (click)="deleteSlot(slot); $event.stopPropagation()" title="Delete">
                          <img src="assets/images/delete.png" alt="Delete" class="delete-icon" />
                        </button>
                      </div>
                    </ng-container>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <app-assignment-dialog
            *ngIf="showAssignmentDialog && selectedTimeSlot"
            [timeSlot]="selectedTimeSlot"
            [subjects]="subjects"
            [professors]="professors"
            [classrooms]="classrooms"
            [selectedMajorId]="selectedMajorId"
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

    .timetable {
      background-color: #fff;
      border-radius: 12px;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      overflow-x: auto;
    }

    .timetable-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      min-width: 800px;
      table-layout: fixed;
    }

    .timetable-table th,
    .timetable-table td {
      border: none;
      padding: 1rem;
      text-align: left;
    }

    .timetable-table th {
      background-color: #f1f5f9;
      font-weight: 600;
      border-bottom: 2px solid #e2e8f0;
    }

    .time-cell {
      background-color: #f1f5f9;
      font-weight: 600;
      min-width: 110px;
      text-align: center;
      border-right: 2px solid #e2e8f0;
      border-bottom: 2px solid #e2e8f0;
    }

    .slot-cell {
      position: relative;
      min-width: 150px;
      text-align: center;
      vertical-align: middle;
      border: 3px solid #333;
      transition: background-color 0.2s, transform 0.2s, border-color 0.2s;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
      cursor: pointer;
    }

    .slot-cell:hover {
      background-color: rgba(0, 0, 0, 0.03);
      transform: translateY(-1px);
    }

    .slot-cell.my-slot, .slot-cell.planning-slot {
      background-color: #e3f2fd;
      border-color: #2196F3;
    }
    .slot-cell.temporary, .slot-cell.reservation-slot {
      background-color: #fff3e0;
      border-color: #ff9800;
    }
    .slot-content {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      font-size: 0.95rem;
      position: relative;
    }

    .slot-content .subject {
      font-weight: 600;
      color: #2c3e50;
    }

    .slot-content .professor {
      color: #555;
    }

    .slot-content .classroom {
      color: #888;
      font-size: 0.85em;
    }
    .reservation-date {
      font-size: 0.8em;
      color: #ff9800;
      margin-top: 4px;
      font-style: italic;
    }
    .delete-btn {
      position: absolute;
      right: 0;
      bottom: 0;
      margin: 4px;
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
      z-index: 2;
      transition: background 0.2s;
    }
    .delete-btn:hover {
      background: #c0392b;
    }
    .delete-icon {
      width: 18px;
      height: 18px;
      display: block;
      pointer-events: none;
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
  timetableData: any[] = [];
  selectedMajorId: number = 0;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private http: HttpClient
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
      day: this.days[0], // Use first day as default
      startTime: range.start,
      endTime: range.end,
      subject: null,
      professor: null,
      classroom: null
    }));
  }

  getTimeSlot(day: string, range: { start: string; end: string }): TimeSlot | null {
    return this.timeSlots.find(slot => 
      slot.day.toLowerCase() === day.toLowerCase() && 
      slot.startTime === range.start && 
      slot.endTime === range.end
    ) || null;
  }

  onMajorChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const majorId = parseInt(select.value);
    this.selectedMajorId = majorId;
    if (majorId) {
      this.dataService.getTimetableByMajor(majorId).subscribe(
        (data) => {
          console.log('API Response:', data);
          
          // Initialize empty time slots for all days
          this.timeSlots = [];
          this.days.forEach(day => {
            this.timeRanges.forEach(range => {
              this.timeSlots.push({
                day,
                startTime: range.start,
                endTime: range.end,
                subject: null,
                professor: null,
                classroom: null
              });
            });
          });

          // Map the API response to time slots
          if (Array.isArray(data)) {
            data.forEach(planning => {
              if (planning && planning.horaire) {
                const idHoraire = planning.horaire.idHoraire;
                // Calculate day index (0-5) and time slot index (0-3)
                const dayIndex = Math.floor((idHoraire - 1) / 4);
                const timeSlotIndex = (idHoraire - 1) % 4;
                
                if (dayIndex >= 0 && dayIndex < this.days.length && 
                    timeSlotIndex >= 0 && timeSlotIndex < this.timeRanges.length) {
                  const timeSlot = this.timeSlots.find(slot => 
                    slot.day === this.days[dayIndex] &&
                    slot.startTime === this.timeRanges[timeSlotIndex].start &&
                    slot.endTime === this.timeRanges[timeSlotIndex].end
                  );

                  if (timeSlot) {
                    timeSlot.subject = planning.matiere;
                    timeSlot.professor = planning.professeur;
                    timeSlot.classroom = planning.salle;
                    timeSlot.type = planning.type;
                    if (planning.type === 'reservation') {
                      timeSlot.reservationDate = planning.reservationDate;
                      timeSlot.idReservation = planning.idReservation;
                    }
                    if (planning.type === 'planning') {
                      timeSlot.idPlanning = planning.idPlanning;
                    }
                  }
                }
              } else {
                console.warn('Invalid planning data:', planning);
              }
            });
          } else {
            console.error('API response is not an array:', data);
          }

          console.log('Updated time slots:', this.timeSlots);
        },
        (error) => {
          console.error('Error fetching timetable:', error);
        }
      );
    } else {
      // Clear time slots when no major is selected
      this.timeSlots = [];
      this.days.forEach(day => {
        this.timeRanges.forEach(range => {
          this.timeSlots.push({
            day,
            startTime: range.start,
            endTime: range.end,
            subject: null,
            professor: null,
            classroom: null
          });
        });
      });
    }
  }

  assignTimeSlot(slot: TimeSlot | null): void {
    if (slot) {
      // Get the horaire ID for the selected time slot
      const horaireId = this.getHoraireId(slot.day, slot.startTime, slot.endTime);
      if (!horaireId) {
        alert('Invalid time slot');
        return;
      }
      this.selectedTimeSlot = { ...slot, horaireId };
      this.showAssignmentDialog = true;
    } else {
      // Create a new time slot if none exists
      const newSlot: TimeSlot = {
        day: this.days[0], // Default to first day
        startTime: this.timeRanges[0].start,
        endTime: this.timeRanges[0].end,
        subject: null,
        professor: null,
        classroom: null,
        horaireId: this.getHoraireId(this.days[0], this.timeRanges[0].start, this.timeRanges[0].end)
      };
      this.selectedTimeSlot = newSlot;
      this.showAssignmentDialog = true;
    }
  }

  private getHoraireId(day: string, startTime: string, endTime: string): number {
    const dayLower = day.toLowerCase();
    
    // Monday
    if (dayLower === 'monday') {
      if (startTime === '08:30' && endTime === '10:30') return 1;
      if (startTime === '10:30' && endTime === '12:30') return 2;
      if (startTime === '14:00' && endTime === '16:00') return 3;
      if (startTime === '16:00' && endTime === '18:00') return 4;
    }
    // Tuesday
    if (dayLower === 'tuesday') {
      if (startTime === '08:30' && endTime === '10:30') return 5;
      if (startTime === '10:30' && endTime === '12:30') return 6;
      if (startTime === '14:00' && endTime === '16:00') return 7;
      if (startTime === '16:00' && endTime === '18:00') return 8;
    }
    // Wednesday
    if (dayLower === 'wednesday') {
      if (startTime === '08:30' && endTime === '10:30') return 9;
      if (startTime === '10:30' && endTime === '12:30') return 10;
      if (startTime === '14:00' && endTime === '16:00') return 11;
      if (startTime === '16:00' && endTime === '18:00') return 12;
    }
    // Thursday
    if (dayLower === 'thursday') {
      if (startTime === '08:30' && endTime === '10:30') return 13;
      if (startTime === '10:30' && endTime === '12:30') return 14;
      if (startTime === '14:00' && endTime === '16:00') return 15;
      if (startTime === '16:00' && endTime === '18:00') return 16;
    }
    // Friday
    if (dayLower === 'friday') {
      if (startTime === '08:30' && endTime === '10:30') return 17;
      if (startTime === '10:30' && endTime === '12:30') return 18;
      if (startTime === '14:00' && endTime === '16:00') return 19;
      if (startTime === '16:00' && endTime === '18:00') return 20;
    }
    // Saturday
    if (dayLower === 'saturday') {
      if (startTime === '08:30' && endTime === '10:30') return 21;
      if (startTime === '10:30' && endTime === '12:30') return 22;
      if (startTime === '14:00' && endTime === '16:00') return 23;
      if (startTime === '16:00' && endTime === '18:00') return 24;
    }

    return 0;
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

  }

  onAssignmentCancel(): void {
    this.showAssignmentDialog = false;
    this.selectedTimeSlot = null;
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
      value: subject.id,
      label: subject.nomMatiere
    }));
  }

  deleteSlot(slot: any): void {
    if (slot.type === 'planning' && slot.idPlanning) {
      this.http.delete(`http://localhost:8090/api/plannings/${slot.idPlanning}`).subscribe({
        next: () => this.onMajorChange({ target: { value: this.selectedMajorId } } as any),
        error: err => alert('Failed to delete planning: ' + err?.error || err)
      });
    } else if (slot.type === 'reservation' && slot.idReservation) {
      this.http.delete(`http://localhost:8090/api/reservations/${slot.idReservation}`).subscribe({
        next: () => this.onMajorChange({ target: { value: this.selectedMajorId } } as any),
        error: err => alert('Failed to delete reservation: ' + err?.error || err)
      });
    }
  }
} 