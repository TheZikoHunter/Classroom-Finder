import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { TimeSlot } from '../../models/time-slot.model';
import { Major } from '../../models/major.model';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="landing-layout">
      <header class="header">
        <div class="logo">Classroom Finder</div>
        <div class="controls">
          <select class="major-select" (change)="onMajorChange($event)">
            <option value="">Select Major</option>
            <option *ngFor="let major of majors" [value]="major.idFiliere">{{major.nomFiliere}}</option>
          </select>
          <button class="login-btn" routerLink="/login">Login</button>
        </div>
      </header>

      <main class="main-content">
        <div class="timetable-panel">
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
                      [class.my-slot]="getTimeSlot(day, range)?.type === 'planning'"
                      [class.temporary]="getTimeSlot(day, range)?.type === 'reservation'">
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
        </div>
      </main>
    </div>
  `,
  styles: [`
    .landing-layout {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .header {
      background-color: #2c3e50;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .controls {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .major-select {
      padding: 0.5rem;
      border-radius: 4px;
      border: 1px solid #ddd;
      min-width: 200px;
      background-color: white;
      color: #333;
    }

    .login-btn {
      padding: 0.5rem 1rem;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .login-btn:hover {
      background-color: #2980b9;
    }

    .main-content {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .timetable {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
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
      padding: 0.75rem;
      text-align: left;
    }

    .timetable-table th {
      background-color: #f8f9fa;
      font-weight: 500;
    }

    .time-cell {
      background-color: #f8f9fa;
      font-weight: 500;
      min-width: 100px;
      max-width: 100px;
    }

    .slot-cell {
      min-width: 150px;
      max-width: 150px;
      transition: background-color 0.2s;
    }

    .slot-cell.my-slot {
      background-color: #e3f2fd;
      border: 2px solid #2196F3;
    }

    .slot-cell.temporary {
      background-color: #fff3e0;
      border: 2px solid #ff9800;
    }

    .slot-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.9rem;
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
      font-size: 0.85rem;
    }

    .reservation-date {
      font-size: 0.8rem;
      color: #ff9800;
      margin-top: 0.25rem;
      font-style: italic;
    }
  `]
})
export class LandingPageComponent implements OnInit {
  majors: Major[] = [];
  timeSlots: TimeSlot[] = [];
  selectedMajorId: number = 0;
  
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  timeRanges = [
    { start: '08:30', end: '10:30' },
    { start: '10:30', end: '12:30' },
    { start: '14:00', end: '16:00' },
    { start: '16:00', end: '18:00' }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadMajors();
    this.initializeTimeSlots();
  }

  loadMajors(): void {
    this.dataService.getMajors().subscribe(data => {
      this.majors = data;
    });
  }

  initializeTimeSlots(): void {
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
          // Initialize empty time slots
          this.initializeTimeSlots();

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
                    timeSlot.type = item.type;
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
      this.initializeTimeSlots();
    }
  }
} 