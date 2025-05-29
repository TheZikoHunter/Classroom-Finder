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
      <!-- Fixed Header -->
      <header class="header">
        <div class="container">
          <!-- Logo Area with image and text -->
          <div class="logo-area">
            <img src="assets/images/logo.png" alt="Logo" class="logo-img">
            <span class="logo-text">Classroom Finder</span>
          </div>
          <div class="controls">
            <select class="major-select" (change)="onMajorChange($event)">
              <option value="">Select Major</option>
              <option *ngFor="let major of majors" [value]="major.idFiliere">{{ major.nomFiliere }}</option>
            </select>
            <button class="login-btn" routerLink="/login">Login</button>
          </div>
        </div>
      </header>

      <!-- Main Content (offset by header height so it doesn’t appear behind the fixed header) -->
      <main class="main-content">
        <div class="timetable-panel">
          <div class="timetable">
            <table class="timetable-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th *ngFor="let day of days">{{ day }}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let range of timeRanges">
                  <td class="time-cell">{{ range.start }} - {{ range.end }}</td>
                  <td *ngFor="let day of days" class="slot-cell"
                      [class.my-slot]="getTimeSlot(day, range)?.type === 'planning'"
                      [class.temporary]="getTimeSlot(day, range)?.type === 'reservation'">
                    <ng-container *ngIf="getTimeSlot(day, range) as slot">
                      <div *ngIf="slot.subject || slot.professor || slot.classroom" class="slot-content">
                        <div *ngIf="slot.subject" class="subject">{{ slot.subject.nomMatiere }}</div>
                        <div *ngIf="slot.professor" class="professor">{{ slot.professor.nomProfesseur }}</div>
                        <div *ngIf="slot.classroom" class="classroom">{{ slot.classroom.nomSalle }}</div>
                        <div *ngIf="slot.reservationDate" class="reservation-date">
                          Reserved for: {{ slot.reservationDate | date }}
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
    /* Global Layout */
    .landing-layout {
      min-height: 100vh;
      background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      display: flex;
      flex-direction: column;
    }

    /* Fixed Header */
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg,rgb(193, 132, 254), #2980b9);
      color: #fff;
      padding: 1rem 2rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 1000;
    }
    
    .header .container {
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Logo Image and Text */
    .logo-area {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logo-img {
      height: 50px;
      width: auto;
    }
    
    .logo-text {
      font-size: 2rem;
      font-weight: bold;
      letter-spacing: 1px;
    }
  
    .controls {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    
    .major-select {
      padding: 0.6rem 1rem;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.6);
      background-color: #fff;
      color: #333;
      font-size: 1rem;
      min-width: 220px;
      transition: border 0.2s;
    }
    
    .major-select:focus {
      outline: none;
      border-color: #2980b9;
    }
  
    /* Enhanced Login Button */
    .login-btn {
      padding: 0.6rem 1.2rem;
      background: linear-gradient(45deg,rgba(247, 132, 100, 0.96), #d35400);
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      font-size: 1rem;
      transition: background 0.3s, box-shadow 0.3s, transform 0.2s;
      box-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
    
    .login-btn:hover {
      background: linear-gradient(45deg, #d35400, #e67e22);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      transform: translateY(-2px);
    }
    
    /* Main Content adjustment to offset the fixed header height */
    .main-content {
      margin-top: 80px; /* Adjust this value based on your header height */
      padding: 2rem;
      max-width: 1400px;
      width: 100%;
      margin-left: auto;
      margin-right: auto;
    }
    
    .timetable-panel {
      overflow-x: auto;
    }
    
    .timetable {
      background-color: #fff;
      border-radius: 12px;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
      padding: 2rem;
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
    
    .timetable-table thead th {
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
      border: 2px solid transparent;
      transition: background-color 0.2s, transform 0.2s;
    }
    
    .slot-cell:hover {
      background-color: rgba(0, 0, 0, 0.03);
      transform: translateY(-1px);
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
      font-size: 0.85rem;
    }
    
    .reservation-date {
      font-size: 0.8rem;
      color: #ff9800;
      margin-top: 0.4rem;
      font-style: italic;
    }
    
    /* Responsive tweaks */
    @media (max-width: 768px) {
      .header {
        padding: 1rem;
      }
      .logo-text {
        font-size: 1.5rem;
      }
      .controls {
        gap: 0.5rem;
      }
      .major-select, .login-btn {
        font-size: 0.9rem;
        padding: 0.5rem 0.8rem;
      }
      .main-content {
        padding: 1rem;
        margin-top: 70px;
      }
      .timetable {
        padding: 1rem;
      }
      .timetable-table th, .timetable-table td {
        padding: 0.75rem;
      }
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
        data => {
          // Reinitialize empty time slots
          this.initializeTimeSlots();

          if (Array.isArray(data)) {
            data.forEach(item => {
              if (item && item.horaire) {
                const idHoraire = item.horaire.idHoraire;
                const dayIndex = Math.floor((idHoraire - 1) / 4);
                const timeSlotIndex = (idHoraire - 1) % 4;
                
                if (
                  dayIndex >= 0 && dayIndex < this.days.length &&
                  timeSlotIndex >= 0 && timeSlotIndex < this.timeRanges.length
                ) {
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
        error => {
          console.error('Error fetching timetable:', error);
        }
      );
    } else {
      this.initializeTimeSlots();
    }
  }
}