import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
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
        <!-- Regular Schedule (Plannings) -->
        <div *ngIf="activeView === 'plannings'" class="timetable">
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
        <div *ngIf="activeView === 'reservations'" class="timetable">
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
                    <div *ngIf="slot.subject || slot.classroom" class="slot-content">
                      <div *ngIf="slot.subject" class="subject">{{slot.subject.nomMatiere}}</div>
                      <div *ngIf="slot.classroom" class="classroom">{{slot.classroom.nomSalle}}</div>
                      <div *ngIf="slot.major" class="major">{{slot.major.nomFiliere}}</div>
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
      transition: background-color 0.2s;
      border: 2px solid transparent;
    }

    .slot-cell:hover {
      background-color: #f5f5f5;
    }

    .slot-cell.planning-slot {
      background-color: #e3f2fd;
      border-color: #2196F3;
    }

    .slot-cell.planning-slot:hover {
      background-color: #bbdefb;
    }

    .slot-cell.reservation-slot {
      background-color: #fff3e0;
      border-color: #ff9800;
    }

    .slot-cell.reservation-slot:hover {
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

    .slot-content .classroom {
      color: #888;
      font-size: 0.85em;
    }

    .slot-content .major {
      color: #666;
      font-size: 0.85em;
    }

    .slot-content .professor {
      color: #666;
      font-size: 0.85em;
      font-style: italic;
    }

    .reservation-date {
      font-size: 0.8em;
      color: #ff9800;
      margin-top: 4px;
      font-style: italic;
    }
  `]
})
export class MyScheduleComponent implements OnInit {
  @Input() professorId!: number;
  activeView: 'plannings' | 'reservations' = 'plannings';
  planningSlots: Planning[] = [];
  reservationSlots: Reservation[] = [];
  
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  timeRanges = [
    { start: '08:30', end: '10:30' },
    { start: '10:30', end: '12:30' },
    { start: '14:00', end: '16:00' },
    { start: '16:00', end: '18:00' }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    if (this.professorId) {
      this.loadPlannings();
      this.loadReservations();
    }
  }

  private loadPlannings() {
    this.dataService.getPlanningsByProfessor(this.professorId).subscribe({
      next: (plannings: Planning[]) => {
        this.planningSlots = plannings;
      },
      error: (error) => {
        console.error('Error loading plannings:', error);
      }
    });
  }

  private loadReservations() {
    this.dataService.getReservationsByProfessor(this.professorId).subscribe({
      next: (reservations: Reservation[]) => {
        this.reservationSlots = reservations;
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
      }
    });
  }

  getPlanningSlot(day: string, range: { start: string; end: string }): Planning | undefined {
    return this.planningSlots.find(planning => 
      planning.horaire.jour.toLowerCase() === day.toLowerCase() && 
      planning.horaire.heure_debut === range.start && 
      planning.horaire.heure_fin === range.end
    );
  }

  getTimeSlot(day: string, range: { start: string; end: string }, type: 'planning' | 'reservation'): TimeSlot | undefined {
    if (type === 'planning') {
      const planning = this.getPlanningSlot(day, range);
      if (planning) {
        return {
          day: planning.horaire.jour,
          startTime: planning.horaire.heure_debut,
          endTime: planning.horaire.heure_fin,
          subject: planning.matiere,
          classroom: planning.salle,
          major: planning.filiere,
          professor: planning.professeur,
          type: 'planning'
        };
      }
      return undefined;
    }
    const reservation = this.reservationSlots.find(res => 
      res.horaire.jour.toLowerCase() === day.toLowerCase() && 
      res.horaire.heure_debut === range.start && 
      res.horaire.heure_fin === range.end
    );
    if (reservation) {
      return {
        day: reservation.horaire.jour,
        startTime: reservation.horaire.heure_debut,
        endTime: reservation.horaire.heure_fin,
        subject: reservation.matiere,
        classroom: reservation.salle,
        major: reservation.filiere,
        professor: reservation.professeur,
        reservationDate: reservation.reservationDate,
        type: 'reservation'
      };
    }
    return undefined;
  }
} 