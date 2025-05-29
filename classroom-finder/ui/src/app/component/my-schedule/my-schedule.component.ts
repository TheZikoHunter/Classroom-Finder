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
  `]
})
export class MyScheduleComponent implements OnInit {
  ngOnInit(): void {}
}