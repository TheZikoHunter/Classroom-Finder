import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Professor } from '../models/professor.model';
import { Subject } from '../models/subject.model';
import { Classroom } from '../models/classroom.model';
import { Major } from '../models/major.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:8090/api';

  private subjects: Subject[] = [
    { id: 1, name: 'Mathematics', code: 'MATH101' },
    { id: 2, name: 'Physics', code: 'PHYS101' }
  ];

  private classrooms: Classroom[] = [
    { nomSalle: 'Room 101' },
    { nomSalle: 'Room 102' }
  ];

  private majors: Major[] = [
    { idFiliere: 1, nomFiliere: 'Computer Science', email_representant: 'cs@example.com' },
    { idFiliere: 2, nomFiliere: 'Engineering', email_representant: 'eng@example.com' }
  ];

  constructor(private http: HttpClient) { }

  // Professor operations
  getProfessors(): Observable<Professor[]> {
    return this.http.get<Professor[]>(`${this.apiUrl}/professeurs`);
  }

  createProfessor(professor: Omit<Professor, 'id_professeur'>): Observable<Professor> {
    return this.http.post<Professor>(`${this.apiUrl}/professeurs`, professor);
  }

  updateProfessor(professor: Professor): Observable<Professor> {
    return this.http.put<Professor>(`${this.apiUrl}/professeurs/${professor.id_professeur}`, professor);
  }

  deleteProfessor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/professeurs/${id}`);
  }

  // Subject operations
  getSubjects(): Observable<Subject[]> {
    return of(this.subjects);
  }

  createSubject(subject: Omit<Subject, 'id'>): Observable<Subject> {
    const newSubject = {
      ...subject,
      id: this.subjects.length + 1
    };
    this.subjects.push(newSubject);
    return of(newSubject);
  }

  updateSubject(subject: Subject): Observable<Subject> {
    const index = this.subjects.findIndex(s => s.id === subject.id);
    if (index !== -1) {
      this.subjects[index] = subject;
      return of(subject);
    }
    throw new Error('Subject not found');
  }

  deleteSubject(id: number): Observable<void> {
    const index = this.subjects.findIndex(s => s.id === id);
    if (index !== -1) {
      this.subjects.splice(index, 1);
      return of(void 0);
    }
    throw new Error('Subject not found');
  }

  // Classroom operations
  getClassrooms(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(`${this.apiUrl}/salles`);
  }

  createClassroom(classroom: { nomSalle: string }): Observable<Classroom> {
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

  createMajor(major: Omit<Major, 'idFiliere'>): Observable<Major> {
    return this.http.post<Major>(`${this.apiUrl}/filieres`, major);
  }

  updateMajor(idFiliere: number, major: Omit<Major, 'idFiliere'>): Observable<Major> {
    return this.http.put<Major>(`${this.apiUrl}/filieres/${idFiliere}`, major);
  }

  deleteMajor(idFiliere: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/filieres/${idFiliere}`);
  }
}