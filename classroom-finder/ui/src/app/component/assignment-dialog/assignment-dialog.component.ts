import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Professor } from '../../models/professor.model';
import { Subject } from '../../models/subject.model';
import { Classroom } from '../../models/classroom.model';
import { TimeSlot } from '../../models/time-slot.model';
import { DataService, Planning } from '../../services/data.service';

@Component({
  selector: 'app-assignment-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dialog-overlay" (click)="onCancel()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <h2>Assign Time Slot</h2>
        <div class="form-group">
          <label>Subject:</label>
          <select [(ngModel)]="selectedSubject" class="form-control">
            <option [ngValue]="null">Select Subject</option>
            <option *ngFor="let subject of subjects" [ngValue]="subject">
              {{subject.nomMatiere}}
            </option>
          </select>
        </div>
        <div class="form-group" *ngIf="!hideProfessorSelect">
          <label>Professor:</label>
          <select [(ngModel)]="selectedProfessor" class="form-control">
            <option [ngValue]="null">Select Professor</option>
            <option *ngFor="let professor of professors" [ngValue]="professor">
              {{professor.nomProfesseur}} {{professor.prenomProfesseur}}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Classroom:</label>
          <select [(ngModel)]="selectedClassroom" class="form-control" [disabled]="!availableClassrooms.length">
            <option [ngValue]="null">Select Classroom</option>
            <option *ngFor="let classroom of availableClassrooms" [ngValue]="classroom">
              {{classroom.nomSalle}}
            </option>
          </select>
          <small *ngIf="!availableClassrooms.length" class="help-text text-warning">
            No classrooms available for this time slot
          </small>
        </div>
        <div class="form-group" *ngIf="showReservationDate">
          <label>Reservation Date (Optional):</label>
          <input type="date" [(ngModel)]="reservationDate" class="form-control" [min]="minDate">
          <small class="help-text">Leave empty for permanent assignment</small>
        </div>
        <div class="dialog-actions">
          <button class="btn-cancel" (click)="onCancel()">Cancel</button>
          <button class="btn-save" (click)="onSave()" [disabled]="!isValid()">Save</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .dialog-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      min-width: 400px;
      max-width: 500px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }

    button {
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-cancel {
      background: #f5f5f5;
      border: 1px solid #ddd;
    }

    .btn-save {
      background: #2196F3;
      color: white;
      border: none;
    }

    .btn-save:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .help-text {
      color: #666;
      font-size: 0.8em;
      margin-top: 4px;
    }

    .text-warning {
      color: #f44336;
    }
  `]
})
export class AssignmentDialogComponent implements OnInit {
  @Input() timeSlot!: TimeSlot;
  @Input() subjects: Subject[] = [];
  @Input() professors: Professor[] = [];
  @Input() classrooms: Classroom[] = [];
  @Input() selectedMajorId: number = 0;
  @Input() hideProfessorSelect: boolean = false;
  @Input() showReservationDate: boolean = false;
  
  @Output() save = new EventEmitter<TimeSlot>();
  @Output() cancel = new EventEmitter<void>();

  selectedSubject: Subject | null = null;
  selectedProfessor: Professor | null = null;
  selectedClassroom: Classroom | null = null;
  reservationDate: string | null = null;
  minDate: string;
  availableClassrooms: Classroom[] = [];

  constructor(private dataService: DataService) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit() {
    if (this.timeSlot) {
      this.selectedSubject = this.timeSlot.subject || null;
      this.selectedProfessor = this.timeSlot.professor || null;
      this.selectedClassroom = this.timeSlot.classroom || null;
      this.reservationDate = this.timeSlot.reservationDate || null;
      
      // Get the horaire ID and fetch available classrooms
      const horaireId = this.getHoraireId();
      if (horaireId) {
        this.dataService.getAvailableClassrooms(horaireId).subscribe({
          next: (classrooms) => {
            this.availableClassrooms = classrooms;
            // If the current classroom is not in available classrooms, reset it
            if (this.selectedClassroom && !this.availableClassrooms.some(c => c.nomSalle === this.selectedClassroom?.nomSalle)) {
              this.selectedClassroom = null;
            }
          },
          error: (error) => {
            console.error('Error fetching available classrooms:', error);
            this.availableClassrooms = [];
          }
        });
      }
    }
  }

  isValid(): boolean {
    return !!this.selectedSubject && 
           (this.hideProfessorSelect || !!this.selectedProfessor) && 
           !!this.selectedClassroom;
  }

  private getHoraireId(): number {
    const day = this.timeSlot.day.toLowerCase();
    const startTime = this.timeSlot.startTime;
    const endTime = this.timeSlot.endTime;

    // Monday
    if (day === 'monday') {
      if (startTime === '08:30' && endTime === '10:30') return 1;
      if (startTime === '10:30' && endTime === '12:30') return 2;
      if (startTime === '14:00' && endTime === '16:00') return 3;
      if (startTime === '16:00' && endTime === '18:00') return 4;
    }
    // Tuesday
    if (day === 'tuesday') {
      if (startTime === '08:30' && endTime === '10:30') return 5;
      if (startTime === '10:30' && endTime === '12:30') return 6;
      if (startTime === '14:00' && endTime === '16:00') return 7;
      if (startTime === '16:00' && endTime === '18:00') return 8;
    }
    // Wednesday
    if (day === 'wednesday') {
      if (startTime === '08:30' && endTime === '10:30') return 9;
      if (startTime === '10:30' && endTime === '12:30') return 10;
      if (startTime === '14:00' && endTime === '16:00') return 11;
      if (startTime === '16:00' && endTime === '18:00') return 12;
    }
    // Thursday
    if (day === 'thursday') {
      if (startTime === '08:30' && endTime === '10:30') return 13;
      if (startTime === '10:30' && endTime === '12:30') return 14;
      if (startTime === '14:00' && endTime === '16:00') return 15;
      if (startTime === '16:00' && endTime === '18:00') return 16;
    }
    // Friday
    if (day === 'friday') {
      if (startTime === '08:30' && endTime === '10:30') return 17;
      if (startTime === '10:30' && endTime === '12:30') return 18;
      if (startTime === '14:00' && endTime === '16:00') return 19;
      if (startTime === '16:00' && endTime === '18:00') return 20;
    }
    // Saturday
    if (day === 'saturday') {
      if (startTime === '08:30' && endTime === '10:30') return 21;
      if (startTime === '10:30' && endTime === '12:30') return 22;
      if (startTime === '14:00' && endTime === '16:00') return 23;
      if (startTime === '16:00' && endTime === '18:00') return 24;
    }

    return 0; // Invalid time slot
  }

  onSave() {
    if (this.isValid()) {
      const horaireId = this.getHoraireId();
      if (horaireId === 0) {
        alert('Invalid time slot');
        return;
      }

      const planning: Planning = {
        idMatiere: this.selectedSubject!.id,
        idHoraire: horaireId,
        idProfesseur: this.hideProfessorSelect ? this.professors[0].id_professeur : this.selectedProfessor!.id_professeur,
        idFiliere: this.selectedMajorId,
        salleId: this.selectedClassroom!.nomSalle
      };

      this.dataService.createPlanning(planning).subscribe({
        next: (response) => {
          const updatedSlot: TimeSlot = {
            day: this.timeSlot.day,
            startTime: this.timeSlot.startTime,
            endTime: this.timeSlot.endTime,
            subject: this.selectedSubject,
            professor: this.hideProfessorSelect ? this.professors[0] : this.selectedProfessor,
            classroom: this.selectedClassroom,
            reservationDate: this.reservationDate
          };
          this.save.emit(updatedSlot);
        },
        error: (error) => {
          console.error('Error creating planning:', error);
          alert('Failed to save the time slot assignment');
        }
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
} 