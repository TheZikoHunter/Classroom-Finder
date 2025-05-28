import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../services/data.service';

interface Planning {
  idPlanning: number;
  type: 'planning';
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

interface Reservation {
  idReservation: number;
  type: 'reservation';
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
  reservationDate: string;
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [DataService]
})
export class ScheduleManagementComponent implements OnInit {
  selectedMajor: Major | undefined;
  majors: Major[] = [];
  plannings: Planning[] = [];
  reservations: Reservation[] = [];
  subjects: Subject[] = [];
  professors: Professor[] = [];
  classrooms: Classroom[] = [];
  userRole: string = 'admin'; // Default to admin, you should get this from your auth service
  
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  timeSlots: string[] = ['8:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'];
  
  showScheduleItemModal = false;
  currentDay = 0;
  currentTimeSlot = 0;
  scheduleItemForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dataService: DataService
  ) {
    this.scheduleItemForm = this.fb.group({
      subjectId: ['', Validators.required],
      professorId: ['', Validators.required],
      classroomId: ['', Validators.required]
    });
    // Get user role from localStorage or your auth service
    this.userRole = localStorage.getItem('userRole') || 'admin';
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
      
      // Use the data service to get both plannings and reservations
      this.dataService.getTimetableByMajor(this.selectedMajor.id)
        .subscribe({
          next: (data: any[]) => {
            console.log('Received combined data:', data);
            // Split the data into plannings and reservations
            this.plannings = data.filter((item: any) => item.type === 'planning');
            this.reservations = data.filter((item: any) => item.type === 'reservation');
            console.log('Plannings:', this.plannings);
            console.log('Reservations:', this.reservations);
          },
          error: (error: any) => {
            console.error('Error loading schedule data:', error);
          }
        });
    }
  }

  getScheduleItem(dayIndex: number, timeIndex: number): Planning | Reservation | undefined {
    // Convert day and time indices to horaire ID
    const horaireId = (dayIndex * 4) + timeIndex + 1;
    
    console.log('Getting schedule item for horaireId:', horaireId);
    console.log('Current reservations:', this.reservations);
    console.log('Current plannings:', this.plannings);
    
    // First check reservations (they take precedence)
    const reservation = this.reservations.find(r => r.horaire.idHoraire === horaireId);
    if (reservation) {
      console.log('Found reservation:', reservation);
      return reservation;
    }
    
    // If no reservation, check plannings
    const planning = this.plannings.find(p => p.horaire.idHoraire === horaireId);
    if (planning) {
      console.log('Found planning:', planning);
    }
    return planning;
  }

  isReservation(item: Planning | Reservation | undefined): boolean {
    return item !== undefined && item.type === 'reservation';
  }

  getSubjectName(item: Planning | Reservation): string {
    return item.matiere.nomMatiere;
  }

  getProfessorName(item: Planning | Reservation): string {
    return `${item.professeur.prenomProfesseur} ${item.professeur.nomProfesseur}`;
  }

  getClassroomName(item: Planning | Reservation): string {
    return item.salle.nomSalle;
  }

  getReservationDate(item: Planning | Reservation): string | undefined {
    if ('reservationDate' in item) {
      return item.reservationDate;
    }
    return undefined;
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
      
      const reservationData = {
        idMatiere: this.scheduleItemForm.value.subjectId,
        idHoraire: horaireId,
        idProfesseur: this.scheduleItemForm.value.professorId,
        idFiliere: this.selectedMajor.id,
        salleId: this.scheduleItemForm.value.classroomId,
        reservationDate: new Date().toISOString().split('T')[0] // Add current date
      };

      console.log('Sending reservation data:', reservationData);

      this.http.post('http://localhost:8090/api/reservations', reservationData)
        .subscribe({
          next: (response) => {
            console.log('Reservation added successfully:', response);
            this.closeScheduleItemModal();
            this.loadSchedule(); // Reload the schedule to show the new item
          },
          error: (error) => {
            console.error('Error adding reservation:', error);
          }
        });
    }
  }

  deleteScheduleItem(item: Planning | Reservation) {
    if ('reservationDate' in item) {
      // It's a reservation
      this.http.delete(`/api/reservations/${item.idReservation}`)
        .subscribe({
          next: () => {
            this.loadSchedule(); // Reload the schedule
          },
          error: (error) => {
            console.error('Error deleting reservation:', error);
          }
        });
    } else {
      // It's a planning
      this.http.delete(`/api/plannings/${item.idPlanning}`)
        .subscribe({
          next: () => {
            this.loadSchedule(); // Reload the schedule
          },
          error: (error) => {
            console.error('Error deleting planning:', error);
          }
        });
    }
  }

  findEmptyClassrooms() {
    // TODO: Implement logic to find empty classrooms
  }

  getScheduleItemClass(item: Planning | Reservation): string {
    // Always show reservations in orange and plannings in blue
    return item.type === 'reservation' ? 'schedule-item reservation-item' : 'schedule-item';
  }
}
