import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { TimeSlot } from '../../models/time-slot.model';
import { Planning } from '../../models/planning.model';
import { Reservation } from '../../models/reservation.model';

@Component({
  selector: 'app-my-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="schedule-container">
      <div class="header">
        <div class="schedule-tabs">
          <button 
            [class.active]="activeView === 'plannings'"
            (click)="activeView = 'plannings'">
            Regular Schedule
          </button>
          <button 
            [class.active]="activeView === 'reservations'"
            (click)="activeView = 'reservations'">
            Reservations
          </button>
        </div>
      </div>

      <div class="schedule-content">
        <!-- Loading state -->
        <div *ngIf="loading" class="loading-message">
          Loading your schedule...
        </div>

        <!-- Error state -->
        <div *ngIf="error" class="error-message">
          {{error}}
        </div>

        <!-- Regular Schedule (Plannings) -->
        <div *ngIf="!loading && !error && activeView === 'plannings'" class="timetable">
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
                    [class.planning-slot]="getPlanningSlot(day, range)">
                  <ng-container *ngIf="getPlanningSlot(day, range) as planning">
                    <div class="slot-content">
                      <div class="subject">{{planning.matiere.nomMatiere}}</div>
                      <div class="classroom">{{planning.salle.nomSalle}}</div>
                      <div class="major">{{planning.filiere.nomFiliere}}</div>
                      <div class="professor">{{planning.filiere.nomFiliere}}</div>
                    </div>
                  </ng-container>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Reservations -->
        <div *ngIf="!loading && !error && activeView === 'reservations'" class="timetable">
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
                    [class.reservation-slot]="getTimeSlot(day, range, 'reservation')">
                  <ng-container *ngIf="getTimeSlot(day, range, 'reservation') as slot">
                    <div *ngIf="slot.matiere || slot.salle" class="slot-content">
                      <div *ngIf="slot.matiere" class="subject">{{slot.matiere.nomMatiere}}</div>
                      <div *ngIf="slot.salle" class="classroom">{{slot.salle.nomSalle}}</div>
                      <div *ngIf="slot.filiere" class="major">{{slot.filiere.nomFiliere}}</div>
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
    </div>
  `,
  styles: [`
    .schedule-container {
      width: 100%;
    }

    .header {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 20px;
    }

    .schedule-tabs {
      display: flex;
      gap: 10px;
    }

    .schedule-tabs button {
      padding: 8px 16px;
      border: none;
      background-color: #f8f9fa;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .schedule-tabs button.active {
      background-color: #007bff;
      color: white;
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
    }

    .slot-cell:hover {
      background-color: rgba(0, 0, 0, 0.03);
      transform: translateY(-1px);
    }

    .slot-cell.planning-slot, .slot-cell.my-slot {
      background-color: #e3f2fd;
      border-color: #2196F3;
    }

    .slot-cell.reservation-slot, .slot-cell.temporary {
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

    .slot-content .classroom {
      color: #888;
      font-size: 0.85em;
    }

    .slot-content .professor {
      color: #555;
    }

    .reservation-date {
      font-size: 0.8em;
      color: #ff9800;
      margin-top: 4px;
      font-style: italic;
    }

    .loading-message {
      text-align: center;
      padding: 2rem;
      color: #666;
      font-size: 1.1rem;
    }

    .error-message {
      text-align: center;
      padding: 2rem;
      color: #e74c3c;
      background-color: #fdf2f2;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      margin: 1rem 0;
    }
  `]
})
export class MyScheduleComponent implements OnInit {
  @Input() currentProfessor: any;
  
  activeView: 'plannings' | 'reservations' = 'plannings';
  plannings: Planning[] = [];
  reservations: Reservation[] = [];
  loading = false;
  error: string | null = null;
  
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
  ) {}

  ngOnInit(): void {
    this.loadScheduleData();
  }

  loadScheduleData(): void {
    const currentUserId = this.authService.getCurrentUserId();
    if (currentUserId) {
      this.loading = true;
      this.error = null;
      
      this.dataService.getTimetableByProfessor(currentUserId).subscribe({
        next: (data) => {
          // Separate plannings and reservations
          this.plannings = data.filter(item => item.type === 'planning');
          this.reservations = data.filter(item => item.type === 'reservation');
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading professor schedule:', error);
          this.error = 'Failed to load schedule data';
          this.loading = false;
        }
      });
    }
  }

  getPlanningSlot(day: string, range: { start: string; end: string }): Planning | null {
    // Find planning for this time slot
    return this.plannings.find(planning => 
      this.matchesTimeSlot(planning, day, range)
    ) || null;
  }

  getTimeSlot(day: string, range: { start: string; end: string }, type: 'reservation'): Reservation | null {
    // Find reservation for this time slot
    return this.reservations.find(reservation => 
      this.matchesTimeSlot(reservation, day, range)
    ) || null;
  }

  private matchesTimeSlot(item: Planning | Reservation, day: string, range: { start: string; end: string }): boolean {
    // Convert day to match the horaire system (1-6 for Monday-Saturday)
    const dayIndex = this.days.indexOf(day);
    const timeIndex = this.timeRanges.findIndex(r => r.start === range.start && r.end === range.end);
    
    if (dayIndex === -1 || timeIndex === -1) return false;
    
    // Calculate expected horaire ID (1-24)
    const expectedHoraireId = (dayIndex * 4) + timeIndex + 1;
    
    return item.horaire?.idHoraire === expectedHoraireId;
  }
}