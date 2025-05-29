import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h1>Classroom Finder</h1>
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              #emailInput="ngModel"
              class="form-control"
              [class.is-invalid]="emailInput.invalid && emailInput.touched"
            >
            <div class="invalid-feedback" *ngIf="emailInput.invalid && emailInput.touched">
              Please enter a valid email address
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              #passwordInput="ngModel"
              class="form-control"
              [class.is-invalid]="passwordInput.invalid && passwordInput.touched"
            >
            <div class="invalid-feedback" *ngIf="passwordInput.invalid && passwordInput.touched">
              Password is required
            </div>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button type="submit" [disabled]="loginForm.invalid" class="login-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    /* Full-page container with a modern gradient background */
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #eef2f3 0%, #8caacd 100%);
      font-family: 'Segoe UI', sans-serif;
    }

    /* Login card with an entrance animation */
    .login-box {
      background: #ffffff;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 420px;
      animation: fadeIn 0.5s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    /* Heading styling */
    h1 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 1.75rem;
      font-size: 2.25rem;
      letter-spacing: 0.5px;
    }

    /* Spacing for the form groups */
    .form-group {
      margin-bottom: 1.5rem;
    }

    /* Label styling */
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #34495e;
    }

    /* Input fields with smooth transitions */
    .form-control {
      width: 100%;
      padding: 0.85rem 1rem;
      border: 1px solid #ccd1d9;
      border-radius: 8px;
      font-size: 1rem;
      transition: border 0.3s, box-shadow 0.3s;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #2980b9;
      box-shadow: 0 0 0 3px rgba(41, 128, 185, 0.2);
    }

    /* Validation feedback styling */
    .is-invalid {
      border-color: #e74c3c;
    }
    
    .invalid-feedback {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.3rem;
    }
    
    .error-message {
      color: #e74c3c;
      margin-bottom: 1.5rem;
      text-align: center;
      font-weight: 500;
    }

    /* Login button styling with gradient and interactive feedback */
    .login-btn {
      width: 100%;
      padding: 0.85rem;
      background: linear-gradient(45deg, #2980b9, #3498db);
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s, transform 0.2s;
    }
    
    .login-btn:hover {
      background: linear-gradient(45deg, #2573a8, #2980b9);
      transform: translateY(-2px);
    }
    
    .login-btn:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
    
    /* Responsive adjustments for smaller screens */
    @media (max-width: 480px) {
      .login-box {
        padding: 1.75rem;
      }
    }
  `]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        // Navigation is handled by the auth service based on user role
      },
      error: (errorMessage: string) => {
        console.error('Login error:', errorMessage);
        this.errorMessage = errorMessage;
      }
    });
  }
}