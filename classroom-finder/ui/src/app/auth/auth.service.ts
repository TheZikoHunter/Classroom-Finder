import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  private readonly API_URL = environment.apiUrl; // Your Spring Boot API URL

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check if user is already logged in
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  // Get headers with authorization token
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 400) {
        errorMessage = error.error || 'Invalid credentials';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized';
      } else if (error.status === 403) {
        errorMessage = 'Forbidden';
      } else if (error.status === 404) {
        errorMessage = 'Not found';
      } else if (error.status === 500) {
        errorMessage = 'Internal server error';
      }
    }
    
    return throwError(() => errorMessage);
  }

  login(email: string, password: string): Observable<any> {
    console.log('Attempting login with:', { email, password });
    console.log('API URL:', `${this.API_URL}/api/auth/login`);
    
    return this.http.post<any>(`${this.API_URL}/api/auth/login`, { email, password }).pipe(
      tap(response => {
        console.log('Login response:', response);
        if (response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          
          // Route based on user role
          if (response.user.role === 'ADMIN') {
            this.router.navigate(['/dashboard']);
          } else if (response.user.role === 'PROFESSOR') {
            this.router.navigate(['/professor-timetable']);
          }
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  isProfessor(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'PROFESSOR';
  }

  // Example of a protected API call
  getProtectedData(): Observable<any> {
    return this.http.get(`${this.API_URL}/api/protected`, { headers: this.getHeaders() });
  }
}
