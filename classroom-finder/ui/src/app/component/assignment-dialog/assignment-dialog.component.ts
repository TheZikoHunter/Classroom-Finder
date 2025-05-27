import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Professor } from '../../models/professor.model';
import { Subject } from '../../models/subject.model';
import { Classroom } from '../../models/classroom.model';
import { TimeSlot } from '../../models/time-slot.model';

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
        <div class="form-group">
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
          <select [(ngModel)]="selectedClassroom" class="form-control">
            <option [ngValue]="null">Select Classroom</option>
            <option *ngFor="let classroom of classrooms" [ngValue]="classroom">
              {{classroom.nomSalle}}
            </option>
          </select>
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
  `]
})
export class AssignmentDialogComponent {
  @Input() timeSlot!: TimeSlot;
  @Input() subjects: Subject[] = [];
  @Input() professors: Professor[] = [];
  @Input() classrooms: Classroom[] = [];
  
  @Output() save = new EventEmitter<TimeSlot>();
  @Output() cancel = new EventEmitter<void>();

  selectedSubject: Subject | null = null;
  selectedProfessor: Professor | null = null;
  selectedClassroom: Classroom | null = null;

  ngOnInit() {
    if (this.timeSlot) {
      this.selectedSubject = this.timeSlot.subject || null;
      this.selectedProfessor = this.timeSlot.professor || null;
      this.selectedClassroom = this.timeSlot.classroom || null;
    }
  }

  isValid(): boolean {
    return !!(this.selectedSubject && this.selectedProfessor && this.selectedClassroom);
  }

  onSave() {
    if (this.timeSlot) {
      const updatedSlot: TimeSlot = {
        day: this.timeSlot.day,
        startTime: this.timeSlot.startTime,
        endTime: this.timeSlot.endTime,
        subject: this.selectedSubject,
        professor: this.selectedProfessor,
        classroom: this.selectedClassroom
      };
      this.save.emit(updatedSlot);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
} 