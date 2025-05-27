import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TimeSlot } from '../../models/time-slot.model';
import { AuthService } from '../../auth/auth.service';
import { DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment';

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
  idFiliere: number;
  email_representant: string;
  nomFiliere: string;
}

interface Subject {
  id: number;
  nomMatiere: string;
}

interface Classroom {
  id: number;
  nomSalle: string;
}

@Component({
  selector: 'app-professor-timetable',
  templateUrl: './professor-timetable.component.html',
  styleUrls: ['./professor-timetable.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ProfessorTimetableComponent implements OnInit {
  selectedMajor: Major | undefined;
  majors: Major[] = [];
  plannings: Planning[] = [];
  subjects: Subject[] = [];
  classrooms: Classroom[] = [];
  currentProfessorId: number = 1; // This should be set from the auth service
  
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  timeSlots: string[] = ['8:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'];
  
  showScheduleItemModal = false;
  currentDay = 0;
  currentTimeSlot = 0;
  scheduleItemForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private dataService: DataService
  ) {
    this.scheduleItemForm = this.fb.group({
      subjectId: ['', Validators.required],
      classroomId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadMajors();
    this.loadSubjects();
    this.loadClassrooms();
    // Get current professor ID from auth service
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentProfessorId = currentUser.id;
    }
  }

  loadMajors() {
    console.log('Loading majors from:', `${environment.apiUrl}/api/filieres`);
    this.http.get<Major[]>(`${environment.apiUrl}/api/filieres`)
      .subscribe({
        next: (data) => {
          console.log('Raw majors data:', data);
          if (Array.isArray(data)) {
            this.majors = data;
            console.log('Processed majors:', this.majors);
          } else {
            console.error('Received non-array data for majors:', data);
            this.majors = [];
          }
        },
        error: (error) => {
          console.error('Error loading majors:', error);
          console.error('Error details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error
          });
          this.majors = [];
        }
      });
  }

  loadSubjects() {
    this.http.get<Subject[]>(`${environment.apiUrl}/api/matieres`)
      .subscribe({
        next: (data) => {
          console.log('Subjects loaded:', data);
          this.subjects = data;
        },
        error: (error) => {
          console.error('Error loading subjects:', error);
          // Fallback to empty array if API fails
          this.subjects = [];
        }
      });
  }

  loadClassrooms() {
    this.http.get<Classroom[]>(`${environment.apiUrl}/api/salles`)
      .subscribe({
        next: (data) => {
          console.log('Classrooms loaded:', data);
          this.classrooms = data;
        },
        error: (error) => {
          console.error('Error loading classrooms:', error);
          // Fallback to empty array if API fails
          this.classrooms = [];
        }
      });
  }

  loadSchedule() {
    if (this.selectedMajor) {
      console.log('Loading schedule for major:', this.selectedMajor);
      const url = `${environment.apiUrl}/api/plannings/recherche-par-filiere/${this.selectedMajor.idFiliere}`;
      console.log('API URL:', url);
      
      this.http.get<Planning[]>(url)
        .subscribe({
          next: (data) => {
            console.log('Received planning data:', data);
            // Show all plannings for the selected major
            this.plannings = data;
            console.log('All plannings:', this.plannings);
          },
          error: (error) => {
            console.error('Error loading schedule:', error);
            // Fallback to empty array if API fails
            this.plannings = [];
          }
        });
    }
  }

  getScheduleItem(dayIndex: number, timeIndex: number): Planning | undefined {
    // Map day and time slot to idHoraire
    // idHoraire mapping:
    // 1-4: Monday (8-10, 10-12, 14-16, 16-18)
    // 5-8: Tuesday
    // 9-12: Wednesday
    // 13-16: Thursday
    // 17-20: Friday
    const idHoraire = (dayIndex * 4) + timeIndex + 1;
    
    console.log('Looking for planning:', {
      dayIndex,
      timeIndex,
      idHoraire,
      plannings: this.plannings
    });

    return this.plannings.find(p => {
      console.log('Comparing planning:', {
        planningIdHoraire: p.horaire.idHoraire,
        targetIdHoraire: idHoraire,
        matches: p.horaire.idHoraire === idHoraire
      });
      return p.horaire.idHoraire === idHoraire;
    });
  }

  getSubjectName(planning: Planning): string {
    return planning.matiere.nomMatiere;
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
      const day = this.days[this.currentDay];
      const [startTime, endTime] = this.timeSlots[this.currentTimeSlot].split('-');
      
      const planningData = {
        idMatiere: this.scheduleItemForm.value.subjectId,
        idHoraire: {
          jour: day,
          heure_debut: startTime,
          heure_fin: endTime
        },
        idProfesseur: this.currentProfessorId,
        idFiliere: this.selectedMajor.idFiliere,
        salleId: this.scheduleItemForm.value.classroomId
      };

      console.log('Sending planning data:', planningData);

      this.http.post(`${environment.apiUrl}/api/plannings`, planningData)
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
    this.http.delete(`${environment.apiUrl}/api/plannings/${id}`)
      .subscribe({
        next: () => {
          console.log('Planning deleted successfully');
          this.loadSchedule(); // Reload the schedule after deletion
        },
        error: (error) => {
          console.error('Error deleting planning:', error);
        }
      });
  }

  findEmptyClassrooms() {
    // TODO: Implement logic to find empty classrooms
    console.log('Finding empty classrooms...');
  }
} 