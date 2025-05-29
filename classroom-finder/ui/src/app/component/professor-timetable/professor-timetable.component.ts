import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TimeSlot } from '../../models/time-slot.model';
import { AuthService } from '../../auth/auth.service';
import { DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment';
import { AssignmentDialogComponent } from '../assignment-dialog/assignment-dialog.component';

interface Planning {
  idPlanning: number;
  salle: {
    nomSalle: string;
  };
  matiere: {
    id: number;
    nomMatiere: string;
  };
  horaire: {
    idHoraire: number;
    heure_debut: string;
    heure_fin: string;
    jour: string;
  };
  professeur: {
    id_professeur: number;
    email: string;
    mot_de_passe: string;
    nomProfesseur: string;
    prenomProfesseur: string;
  };
  filiere: {
    idFiliere: number;
    email_representant: string;
    nomFiliere: string;
  };
}

interface Major {
  idFiliere: number;
  email_representant: string;
  nomFiliere: string;
}

interface Subject {
  id: number;
  nomMatiere: string;
}

interface Classroom {
  id: number;
  nomSalle: string;
}

@Component({
  selector: 'app-professor-timetable',
  standalone: true,
  imports: [CommonModule, FormsModule, AssignmentDialogComponent],
  template: `
    <div class="dashboard-layout">
      <main class="main-content">
        <div class="timetable-panel">
          <div class="header">
            <h1>Professor Timetable</h1>
            <div class="controls">
              <select class="major-select" (change)="onMajorChange($event)">
                <option value="">Select Major</option>
                <option *ngFor="let major of majors" [value]="major.idFiliere">{{major.nomFiliere}}</option>
              </select>
              <button class="logout-btn" (click)="logout()">Logout</button>
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
                  <td *ngFor="let day of days" class="slot-cell" 
                      [class.my-slot]="getTimeSlot(day, range)?.type === 'planning' && getTimeSlot(day, range)?.professor?.id_professeur === currentProfessor?.id_professeur"
                      [class.temporary]="getTimeSlot(day, range)?.type === 'reservation'"
                      (click)="assignTimeSlot(getTimeSlot(day, range))">
                    <ng-container *ngIf="getTimeSlot(day, range) as slot">
                      <div *ngIf="slot.subject || slot.professor || slot.classroom" class="slot-content">
                        <div *ngIf="slot.subject" class="subject">{{slot.subject.nomMatiere}}</div>
                        <div *ngIf="slot.professor" class="professor">{{slot.professor.nomProfesseur}}</div>
                        <div *ngIf="slot.classroom" class="classroom">{{slot.classroom.nomSalle}}</div>
                        <div *ngIf="slot.reservationDate" class="reservation-date">
                          Reserved for: {{slot.reservationDate | date}}
                        </div>
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
            [professors]="[currentProfessor]"
            [classrooms]="classrooms"
            [selectedMajorId]="selectedMajorId"
            [hideProfessorSelect]="true"
            [showReservationDate]="true"
            (save)="onAssignmentSave($event)"
            (cancel)="onAssignmentCancel()">
          </app-assignment-dialog>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      padding: 20px;
      background-color: #f5f5f5;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .controls {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .major-select {
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ddd;
      min-width: 200px;
    }

    .logout-btn {
      padding: 8px 16px;
      background-color: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .logout-btn:hover {
      background-color: #c0392b;
    }

    .timetable {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
      overflow-x: auto;
    }

    .timetable-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px;
    }

    .timetable-table th,
    .timetable-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    .timetable-table th {
      background-color: #f5f5f5;
      font-weight: 500;
    }

    .time-cell {
      background-color: #f9f9f9;
      font-weight: 500;
      min-width: 100px;
      max-width: 100px;
    }

    .slot-cell {
      min-width: 150px;
      max-width: 150px;
      cursor: pointer;
      transition: background-color 0.2s;
      border: 2px solid transparent;
    }

    .slot-cell:hover {
      background-color: #f5f5f5;
    }

    .slot-cell.my-slot {
      background-color: #e3f2fd;
      border-color: #2196F3;
    }

    .slot-cell.my-slot:hover {
      background-color: #bbdefb;
    }

    .slot-cell.temporary {
      background-color: #fff3e0;
      border-color: #ff9800;
    }

    .slot-cell.temporary:hover {
      background-color: #ffe0b2;
    }

    .slot-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 0.9em;
    }

    .slot-content .subject {
      font-weight: 500;
      color: #2196F3;
    }

    .slot-content .professor {
      color: #666;
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
  `]
})
export class ProfessorTimetableComponent implements OnInit {
  majors: Major[] = [];
  subjects: Subject[] = [];
  classrooms: Classroom[] = [];
  currentProfessor: any;
  timeSlots: TimeSlot[] = [];
  showAssignmentDialog = false;
  selectedTimeSlot: TimeSlot | null = null;
  selectedMajorId: number = 0;
  
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  timeRanges = [
    { start: '08:30', end: '10:30' },
    { start: '10:30', end: '12:30' },
    { start: '14:00', end: '16:00' },
    { start: '16:00', end: '18:00' }
  ];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.loadData();
    this.initializeTimeSlots();
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentProfessor = {
        id_professeur: currentUser.id,
        nomProfesseur: currentUser.email.split('@')[0],
        prenomProfesseur: ''
      };
    }
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

  initializeTimeSlots(): void {
    this.timeSlots = this.timeRanges.map(range => ({
      day: this.days[0],
      startTime: range.start,
      endTime: range.end,
      subject: null,
      professor: this.currentProfessor,
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
          
          this.timeSlots = [];
          this.days.forEach(day => {
            this.timeRanges.forEach(range => {
              this.timeSlots.push({
                day,
                startTime: range.start,
                endTime: range.end,
                subject: null,
                professor: null,
                classroom: null,
                type: null
              });
            });
          });

          if (Array.isArray(data)) {
            data.forEach(item => {
              if (item && item.horaire) {
                const idHoraire = item.horaire.idHoraire;
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
                    timeSlot.subject = item.matiere;
                    timeSlot.professor = item.professeur;
                    timeSlot.classroom = item.salle;
                    timeSlot.type = item.type; // 'planning' or 'reservation'
                    if (item.type === 'reservation') {
                      timeSlot.reservationDate = item.reservationDate;
                    }
                  }
                }
              }
            });
          }
        },
        (error) => {
          console.error('Error fetching timetable:', error);
        }
      );
    } else {
      this.timeSlots = [];
      this.days.forEach(day => {
        this.timeRanges.forEach(range => {
          this.timeSlots.push({
            day,
            startTime: range.start,
            endTime: range.end,
            subject: null,
            professor: null,
            classroom: null,
            type: null
          });
        });
      });
    }
  }

  assignTimeSlot(slot: TimeSlot | null): void {
    if (slot) {
      if (slot.professor && slot.professor.id_professeur !== this.currentProfessor.id_professeur) {
        alert('This time slot is already assigned to another professor');
        return;
      }
      this.selectedTimeSlot = slot;
      this.showAssignmentDialog = true;
    }
  }

  onAssignmentSave(updatedSlot: TimeSlot): void {
    const index = this.timeSlots.findIndex(slot => 
      slot.day === updatedSlot.day && 
      slot.startTime === updatedSlot.startTime && 
      slot.endTime === updatedSlot.endTime
    );
    
    if (index !== -1) {
      this.timeSlots[index] = {
        ...updatedSlot,
        professor: this.currentProfessor,
        type: 'reservation'
      };
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

  logout(): void {
    this.authService.logout();
  }
} 