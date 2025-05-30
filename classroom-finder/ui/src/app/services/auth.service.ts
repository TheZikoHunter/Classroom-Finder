import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError, map } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  email: string;        // Changed from username to email
  motDePasse: string;   // Changed from password to motDePasse
}

export interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly TOKEN_KEY = 'auth_token';
  private readonly API_URL = 'http://localhost:8090/api/auth'; // Your backend URL

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check for stored token on service initialization
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      // You can add token validation here if needed
      const storedUser = localStorage.getItem('current_user');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          // Store token and user data
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem('current_user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }),
        // Map the response to just the user object
        // Import 'map' from 'rxjs/operators' at the top if not already imported
        // import { map } from 'rxjs/operators';
        // Or use: import { map } from 'rxjs';
        // Here, using 'map' from 'rxjs'
        // Add 'map' to the import statement at the top
        map(response => response.user),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => new Error('Invalid credentials'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}