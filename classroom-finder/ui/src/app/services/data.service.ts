import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Professor } from '../models/professor.model';
import { Subject } from '../models/subject.model';
import { Classroom } from '../models/classroom.model';
import { Major } from '../models/major.model';

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

  createProfessor(professor: Professor): Observable<Professor> {
    return this.http.post<Professor>(`${this.apiUrl}/professeurs`, professor);
  }

  updateProfessor(professor: Professor): Observable<Professor> {
    return this.http.put<Professor>(`${this.apiUrl}/professeurs/${professor.id}`, professor);
  }

  deleteProfessor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/professeurs/${id}`);
  }

  // Subject operations
  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}/matieres`);
  }

  createSubject(subject: { nomMatiere: string }): Observable<Subject> {
    return this.http.post<Subject>(`${this.apiUrl}/matieres`, subject);
  }

  updateSubject(id: number, subject: { nomMatiere: string }): Observable<Subject> {
    return this.http.put<Subject>(`${this.apiUrl}/matieres/${id}`, subject);
  }

  deleteSubject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/matieres/${id}`);
  }

  // Classroom operations
  getClassrooms(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(`${this.apiUrl}/salles`);
  }

  createClassroom(classroom: Classroom): Observable<Classroom> {
    return this.http.post<Classroom>(`${this.apiUrl}/salles`, classroom);
  }

  updateClassroom(oldNomSalle: string, newNomSalle: string): Observable<Classroom> {
    return this.http.put<Classroom>(`${this.apiUrl}/salles/${oldNomSalle}`, { nomSalle: newNomSalle });
  }

  deleteClassroom(nomSalle: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/salles/${nomSalle}`);
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
}