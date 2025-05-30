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
    idProfesseur: number;
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
                      [class.my-slot]="getTimeSlot(day, range)?.type === 'planning' && getTimeSlot(day, range)?.professor?.idProfesseur === currentProfessor?.idProfesseur"
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
      border: 5px solid #000;
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
    this.initializeTimeSlots();
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      // Get the actual professor data instead of just creating a basic object
      this.dataService.getProfessorById(currentUser.id).subscribe({
        next: (professor) => {
          this.currentProfessor = professor;
          // Load data after setting the current professor
          this.loadData();
        },
        error: (error) => {
          console.error('Error fetching professor:', error);
          // Fallback to basic object
          this.currentProfessor = {
            idProfesseur: currentUser.id,
            nomProfesseur: currentUser.email.split('@')[0],
            prenomProfesseur: ''
          };
          this.loadData();
        }
      });
    } else {
      this.loadData();
    }
  }

  loadData(): void {
    this.dataService.getClassrooms().subscribe(data => {
      this.classrooms = data;
    });

    this.dataService.getMajors().subscribe(data => {
      this.majors = data;
    });

    // Load subjects specific to the current professor
    if (this.currentProfessor?.idProfesseur) {
      console.log('Loading subjects for professor ID:', this.currentProfessor.idProfesseur);
      this.dataService.getSubjectsByProfessor(this.currentProfessor.idProfesseur).subscribe({
        next: (data) => {
          console.log('Subjects received for professor:', data);
          this.subjects = data;
        },
        error: (error) => {
          console.error('Error loading subjects for professor:', error);
          // Fallback to all subjects if professor-specific subjects fail
          this.dataService.getSubjects().subscribe(fallbackData => {
            console.log('Using fallback subjects:', fallbackData);
            this.subjects = fallbackData;
          });
        }
      });
    } else {
      console.log('No professor ID available, loading all subjects');
      this.dataService.getSubjects().subscribe(data => {
        this.subjects = data;
      });
    }
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
      if (slot.professor && slot.professor.idProfesseur !== this.currentProfessor.idProfesseur) {
        alert('This time slot is already assigned to another professor');
        return;
      }
      // Get the horaire ID for the selected time slot
      const horaireId = this.getHoraireId(slot.day, slot.startTime, slot.endTime);
      if (!horaireId) {
        alert('Invalid time slot');
        return;
      }
      this.selectedTimeSlot = { ...slot, horaireId };
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