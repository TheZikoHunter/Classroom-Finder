import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeSlot } from '../../models/time-slot.model';
import { AuthService } from '../../auth/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-professor-timetable',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="timetable-container">
      <div class="header">
        <h1>My Timetable</h1>
        <div class="user-info">
          <span>Welcome, {{currentUser?.username}}</span>
          <button class="logout-btn" (click)="logout()">Logout</button>
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
          <div *ngFor="let slot of filteredTimeSlots" class="time-slot">
            <div class="time-range">
              {{slot.startTime}} - {{slot.endTime}}
            </div>
            <div class="slot-details">
              <div class="subject">{{slot.subject?.nomMatiere || 'No subject'}}</div>
              <div class="classroom">{{slot.classroom?.nomSalle || 'No classroom'}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timetable-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .logout-btn {
      padding: 8px 16px;
      background-color: #e74c3c;
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
  `]
})
export class ProfessorTimetableComponent implements OnInit {
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  selectedDay: string = 'Monday';
  timeSlots: TimeSlot[] = [];
  currentUser: any;

  constructor(
    private authService: AuthService,
    private dataService: DataService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadTimeSlots();
  }

  loadTimeSlots(): void {
    // TODO: Implement API call to get professor's timetable
    // For now, using mock data
    this.timeSlots = [
      {
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:30',
        subject: { idMatiere: 1, nomMatiere: 'Mathematics' },
        professor: null,
        classroom: { nomSalle: 'Room 101' }
      },
      {
        day: 'Monday',
        startTime: '11:00',
        endTime: '12:30',
        subject: { idMatiere: 2, nomMatiere: 'Physics' },
        professor: null,
        classroom: { nomSalle: 'Room 102' }
      }
    ];
  }

  get filteredTimeSlots(): TimeSlot[] {
    return this.timeSlots.filter(slot => slot.day === this.selectedDay);
  }

  onDayChange(day: string): void {
    this.selectedDay = day;
  }

  logout(): void {
    this.authService.logout();
  }
} 