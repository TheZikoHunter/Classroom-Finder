import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly TOKEN_KEY = 'auth_token';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check for stored token on service initialization
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      // In a real app, you would validate the token here
      this.currentUserSubject.next({
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin'
      });
    }
  }

  login(credentials: LoginCredentials): Observable<User> {
    // In a real app, this would be an API call
    // For now, we'll simulate a successful login
    return new Observable<User>(observer => {
      if (credentials.username === 'admin' && credentials.password === 'admin') {
        const user: User = {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin'
        };
        localStorage.setItem(this.TOKEN_KEY, 'dummy-token');
        this.currentUserSubject.next(user);
        observer.next(user);
        observer.complete();
      } else {
        observer.error('Invalid credentials');
      }
    });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
} 