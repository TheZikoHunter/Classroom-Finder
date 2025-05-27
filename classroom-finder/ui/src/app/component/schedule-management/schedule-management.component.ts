import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Major {
  id: number;
  name: string;
  year: number;
}

interface Subject {
  id: number;
  name: string;
}

interface Professor {
  id: number;
  firstName: string;
  lastName: string;
}

interface Classroom {
  id: number;
  name: string;
}

interface ScheduleItem {
  id: number;
  subjectId: number;
  professorId: number;
  classroomId: number;
}

@Component({
  selector: 'app-schedule-management',
  templateUrl: './schedule-management.component.html',
  styleUrls: ['./schedule-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ScheduleManagementComponent implements OnInit {
  selectedMajor: Major | undefined;
  majors: Major[] = [];
  subjects: Subject[] = [];
  professors: Professor[] = [];
  classrooms: Classroom[] = [];
  scheduleItems: ScheduleItem[] = [];
  
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  timeSlots: string[] = ['8:00-9:30', '9:45-11:15', '11:30-13:00', '13:30-15:00', '15:15-16:45'];
  
  showScheduleItemModal = false;
  currentDay = 0;
  currentTimeSlot = 0;
  scheduleItemForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.scheduleItemForm = this.fb.group({
      subjectId: ['', Validators.required],
      professorId: ['', Validators.required],
      classroomId: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Initialize data
    this.loadMajors();
    this.loadSubjects();
    this.loadProfessors();
    this.loadClassrooms();
  }

  loadMajors() {
    // TODO: Implement API call
    this.majors = [
      { id: 1, name: 'Computer Science', year: 1 },
      { id: 2, name: 'Computer Science', year: 2 }
    ];
  }

  loadSubjects() {
    // TODO: Implement API call
    this.subjects = [
      { id: 1, name: 'Mathematics' },
      { id: 2, name: 'Programming' }
    ];
  }

  loadProfessors() {
    // TODO: Implement API call
    this.professors = [
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Jane', lastName: 'Smith' }
    ];
  }

  loadClassrooms() {
    // TODO: Implement API call
    this.classrooms = [
      { id: 1, name: 'Room 101' },
      { id: 2, name: 'Room 102' }
    ];
  }

  loadSchedule() {
    // TODO: Implement API call to load schedule for selected major
  }

  getScheduleItem(dayIndex: number, timeIndex: number): ScheduleItem | undefined {
    // TODO: Implement logic to get schedule item
    return undefined;
  }

  getSubjectName(subjectId: number): string {
    const subject = this.subjects.find(s => s.id === subjectId);
    return subject ? subject.name : '';
  }

  getProfessorName(professorId: number): string {
    const professor = this.professors.find(p => p.id === professorId);
    return professor ? `${professor.firstName} ${professor.lastName}` : '';
  }

  getClassroomName(classroomId: number): string {
    const classroom = this.classrooms.find(c => c.id === classroomId);
    return classroom ? classroom.name : '';
  }

  openAddScheduleItemModal(dayIndex: number, timeIndex: number) {
    this.currentDay = dayIndex;
    this.currentTimeSlot = timeIndex;
    this.showScheduleItemModal = true;
  }

  closeScheduleItemModal() {
    this.showScheduleItemModal = false;
    this.scheduleItemForm.reset();
  }

  addScheduleItem() {
    if (this.scheduleItemForm.valid) {
      // TODO: Implement API call to add schedule item
      this.closeScheduleItemModal();
    }
  }

  deleteScheduleItem(id: number) {
    // TODO: Implement API call to delete schedule item
  }

  findEmptyClassrooms() {
    // TODO: Implement logic to find empty classrooms
  }
}
