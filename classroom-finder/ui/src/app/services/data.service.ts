import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Professor } from '../models/professor.model';
import { Subject } from '../models/subject.model';
import { Classroom } from '../models/classroom.model';
import { Major } from '../models/major.model';

export interface Planning {
  idMatiere: number;
  idHoraire: number;
  idProfesseur: number;
  idFiliere: number;
  salleId: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:8090/api';

  constructor(private http: HttpClient) { }

  // Professor operations
  getProfessors(): Observable<Professor[]> {
    return this.http.get<Professor[]>(`${this.apiUrl}/professeurs`);
  }

  getProfessorById(idProfesseur: number): Observable<Professor> {
    return this.http.get<Professor>(`${this.apiUrl}/professeurs/${idProfesseur}`);
  }

  createProfessor(professor: Omit<Professor, 'idProfesseur'>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/professeurs`, professor);
  }

  updateProfessor(professor: Professor): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/professeurs/${professor.idProfesseur}`, professor);
  }

  deleteProfessor(idProfesseur: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/professeurs/${idProfesseur}`);
  }

  // Subject operations
  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}/matieres`);
  }

  // Get subjects assigned to a specific professor using the new assignment system
  getSubjectsByProfessor(professorId: number): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}/professor-subjects/professor/${professorId}`);
  }

  createSubject(subject: { nomMatiere: string }): Observable<Subject> {
    return this.http.post<Subject>(`${this.apiUrl}/matieres`, subject);
  }

  updateSubject(idMatiere: number, subject: { nomMatiere: string }): Observable<Subject> {
    return this.http.put<Subject>(`${this.apiUrl}/matieres/${idMatiere}`, subject);
  }

  deleteSubject(idMatiere: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/matieres/${idMatiere}`);
  }

  // Classroom operations
  getClassrooms(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(`${this.apiUrl}/salles`);
  }

  createClassroom(classroom: Classroom): Observable<Classroom> {
    return this.http.post<Classroom>(`${this.apiUrl}/salles`, classroom);
  }

  updateClassroom(id: number, classroom: Classroom): Observable<Classroom> {
    return this.http.put<Classroom>(`${this.apiUrl}/salles/${id}`, classroom);
  }

  deleteClassroom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/salles/${id}`);
  }

  // Major operations
  getMajors(): Observable<Major[]> {
    return this.http.get<Major[]>(`${this.apiUrl}/filieres`);
  }

  createMajor(major: Major): Observable<Major> {
    return this.http.post<Major>(`${this.apiUrl}/filieres`, major);
  }

  updateMajor(id: number, major: Major): Observable<Major> {
    return this.http.put<Major>(`${this.apiUrl}/filieres/${id}`, major);
  }

  deleteMajor(idFiliere: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/filieres/${idFiliere}`);
  }

  // Timetable operations
  getTimetableByMajor(majorId: number): Observable<any[]> {
    // Fetch both plannings and reservations
    const plannings$ = this.http.get<any[]>(`${this.apiUrl}/plannings/recherche-par-filiere/${majorId}`);
    const reservations$ = this.http.get<any[]>(`${this.apiUrl}/reservations/recherche-par-filiere/${majorId}`);

    // Combine both observables and merge their results
    return forkJoin({
      plannings: plannings$,
      reservations: reservations$
    }).pipe(
      map(({ plannings, reservations }) => {
        // Add a type field to distinguish between plannings and reservations
        const typedPlannings = plannings.map(p => ({ ...p, type: 'planning' }));
        const typedReservations = reservations.map(r => ({ ...r, type: 'reservation' }));
        
        // Combine both arrays
        return [...typedPlannings, ...typedReservations];
      })
    );
  }

  // Get timetable (plannings and reservations) for a specific professor
  getTimetableByProfessor(professorId: number): Observable<any[]> {
    // Fetch both plannings and reservations for the professor
    const plannings$ = this.http.get<any[]>(`${this.apiUrl}/plannings/professor/${professorId}`);
    const reservations$ = this.http.get<any[]>(`${this.apiUrl}/reservations/professor/${professorId}`);

    // Combine both observables and merge their results
    return forkJoin({
      plannings: plannings$,
      reservations: reservations$
    }).pipe(
      map(({ plannings, reservations }) => {
        // Add a type field to distinguish between plannings and reservations
        const typedPlannings = plannings.map(p => ({ ...p, type: 'planning' }));
        const typedReservations = reservations.map(r => ({ ...r, type: 'reservation' }));
        
        // Combine both arrays
        return [...typedPlannings, ...typedReservations];
      })
    );
  }

  // Get available classrooms for a specific time slot
  getAvailableClassrooms(horaireId: number): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(`${this.apiUrl}/plannings/available-classrooms/${horaireId}`);
  }

  // Planning operations
  createPlanning(planning: Planning): Observable<Planning> {
    return this.http.post<Planning>(`${this.apiUrl}/plannings`, planning);
  }
}