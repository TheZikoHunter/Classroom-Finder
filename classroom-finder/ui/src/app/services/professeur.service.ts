import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Professeur {
  idProfesseur?: number;
  email: string;
  motDePasse?: string;
  nomProfesseur: string;
  prenomProfesseur: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ProfesseurService {
  private readonly API_URL = 'http://localhost:8090/api/professeurs';

  constructor(private http: HttpClient) {}

  getAllProfesseurs(): Observable<Professeur[]> {
    return this.http.get<Professeur[]>(this.API_URL);
  }

  getProfesseurById(id: number): Observable<Professeur> {
    return this.http.get<Professeur>(`${this.API_URL}/${id}`);
  }

  createProfesseur(professeur: Professeur): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.API_URL, professeur);
  }

  updateProfesseur(id: number, professeur: Professeur): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.API_URL}/${id}`, professeur);
  }

  deleteProfesseur(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API_URL}/${id}`);
  }
}