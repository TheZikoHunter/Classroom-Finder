import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
    id_professeur: number;
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
  id: string;
  name: string;
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
  plannings: Planning[] = [];
  subjects: Subject[] = [];
  professors: Professor[] = [];
  classrooms: Classroom[] = [];
  
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  timeSlots: string[] = ['8:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'];
  
  showScheduleItemModal = false;
  currentDay = 0;
  currentTimeSlot = 0;
  scheduleItemForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.scheduleItemForm = this.fb.group({
      subjectId: ['', Validators.required],
      professorId: ['', Validators.required],
      classroomId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadMajors();
    this.loadSubjects();
    this.loadProfessors();
    this.loadClassrooms();
  }

  loadMajors() {
    // TODO: Implement API call to get majors
    this.majors = [
      { id: 1, name: '2ADSE', year: 2 },
      { id: 2, name: '2ADSE', year: 3 }
    ];
  }

  loadSubjects() {
    // TODO: Implement API call to get subjects
    this.subjects = [
      { id: 1, name: 'Mathematics' },
      { id: 2, name: 'Programming' },
      { id: 3, name: 'Physics' }
    ];
  }

  loadProfessors() {
    // TODO: Implement API call to get professors
    this.professors = [
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Jane', lastName: 'Smith' },
      { id: 3, firstName: 'Bob', lastName: 'Johnson' }
    ];
  }

  loadClassrooms() {
    // TODO: Implement API call to get classrooms
    this.classrooms = [
      { id: 'A1', name: 'A1' },
      { id: 'A2', name: 'A2' },
      { id: 'A3', name: 'A3' }
    ];
  }

  loadSchedule() {
    if (this.selectedMajor) {
      console.log('Loading schedule for major:', this.selectedMajor);
      const url = `/api/planning/recherche-par-filiere/${this.selectedMajor.id}`;
      console.log('API URL:', url);
      
      this.http.get<Planning[]>(url)
        .subscribe({
          next: (data) => {
            console.log('Received planning data:', data);
            this.plannings = data;
          },
          error: (error) => {
            console.error('Error loading schedule:', error);
          }
        });
    }
  }

  getScheduleItem(dayIndex: number, timeIndex: number): Planning | undefined {
    // Convert day and time indices to horaire ID
    const horaireId = (dayIndex * 4) + timeIndex + 1;
    console.log(`Looking for planning with horaireId ${horaireId} at day ${dayIndex}, time ${timeIndex}`);
    const planning = this.plannings.find(p => p.horaire.idHoraire === horaireId);
    console.log('Found planning:', planning);
    return planning;
  }

  getSubjectName(planning: Planning): string {
    return planning.matiere.nomMatiere;
  }

  getProfessorName(planning: Planning): string {
    return `${planning.professeur.prenomProfesseur} ${planning.professeur.nomProfesseur}`;
  }

  getClassroomName(planning: Planning): string {
    return planning.salle.nomSalle;
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
    if (this.scheduleItemForm.valid && this.selectedMajor) {
      const horaireId = (this.currentDay * 4) + this.currentTimeSlot + 1;
      
      const planningData = {
        idMatiere: this.scheduleItemForm.value.subjectId,
        idHoraire: horaireId,
        idProfesseur: this.scheduleItemForm.value.professorId,
        idFiliere: this.selectedMajor.id,
        salleId: this.scheduleItemForm.value.classroomId
      };

      console.log('Sending planning data:', planningData);

      this.http.post('/api/plannings', planningData)
        .subscribe({
          next: (response) => {
            console.log('Planning added successfully:', response);
            this.closeScheduleItemModal();
            this.loadSchedule(); // Reload the schedule to show the new item
          },
          error: (error) => {
            console.error('Error adding planning:', error);
          }
        });
    }
  }

  deleteScheduleItem(id: number) {
    // TODO: Implement API call to delete schedule item
  }

  findEmptyClassrooms() {
    // TODO: Implement logic to find empty classrooms
  }
}
