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
        <div class="logo-container">
          <div class="logo-placeholder">
            <img src="assets/images/logo.png" alt="INSEA Logo" class="logo-img" />
          </div>
          <h1>Classroom Finder</h1>
          <p class="subtitle">Welcome back! Please login to your account.</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="login-form">
          <div class="form-group">
            <label for="email">Email Address</label>
            <div class="input-wrapper">
              <i class="fas fa-envelope input-icon"></i>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="email"
                required
                #emailInput="ngModel"
                class="form-control"
                [class.is-invalid]="emailInput.invalid && emailInput.touched"
                placeholder="Enter your email"
              >
            </div>
            <div class="invalid-feedback" *ngIf="emailInput.invalid && emailInput.touched">
              Please enter a valid email address
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <i class="fas fa-lock input-icon"></i>
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="password"
                name="password"
                [(ngModel)]="password"
                required
                #passwordInput="ngModel"
                class="form-control"
                [class.is-invalid]="passwordInput.invalid && passwordInput.touched"
                placeholder="Enter your password"
              >
              <button 
                type="button"
                class="password-toggle"
                (click)="togglePasswordVisibility()"
                [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
              >
                <i class="fas" [class.fa-eye]="!showPassword" [class.fa-eye-slash]="showPassword"></i>
              </button>
            </div>
            <div class="invalid-feedback" *ngIf="passwordInput.invalid && passwordInput.touched">
              Password is required
            </div>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe">
              <span>Remember me</span>
            </label>
            <a href="#" class="forgot-password">Forgot Password?</a>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            <i class="fas fa-exclamation-circle"></i>
            {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            [disabled]="loginForm.invalid || isLoading" 
            class="login-btn"
            [class.loading]="isLoading"
          >
            <span class="btn-text" *ngIf="!isLoading">Sign In</span>
            <div class="spinner" *ngIf="isLoading"></div>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%);
      font-family: 'Inter', sans-serif;
      position: relative;
      overflow: hidden;
    }

    .login-container::before {
      content: '';
      position: absolute;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%);
      animation: rotate 30s linear infinite;
      z-index: 0;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .login-box {
      background: rgba(255, 255, 255, 0.95);
      padding: 2.5rem;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 420px;
      position: relative;
      z-index: 1;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .logo-container {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo-placeholder {
      width: 90px;
      height: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      background: none;
      border-radius: 0;
    }

    .logo-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #666;
      font-size: 0.95rem;
      margin-bottom: 0;
    }

    .login-form {
      margin-top: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #4a4a4a;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .input-wrapper {
      position: relative;
      width: 100%;
      box-sizing: border-box;
    }

    .form-control {
      width: 100%;
      box-sizing: border-box;
      padding: 0.75rem 2.5rem 0.75rem 2.5rem;
      border: 1.5px solid #e1e5eb;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      background: #f8fafc;
      height: 42px;
    }

    .form-control:focus {
      outline: none;
      border-color: #2196F3;
      background: white;
      box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.1);
    }

    .form-control::placeholder {
      color: #a0aec0;
    }

    .input-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
      font-size: 1rem;
      pointer-events: none;
      z-index: 1;
    }

    .password-toggle {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      padding: 0.25rem;
      cursor: pointer;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
      z-index: 1;
    }

    .password-toggle:hover {
      color: #2196F3;
    }

    .password-toggle i {
      font-size: 1rem;
    }

    .password-toggle:focus {
      outline: none;
    }

    .password-toggle:focus-visible {
      outline: 2px solid #2196F3;
      outline-offset: 2px;
      border-radius: 4px;
    }

    .is-invalid {
      border-color: #dc3545;
      background: #fff5f5;
    }

    .invalid-feedback {
      color: #dc3545;
      font-size: 0.8rem;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #4a4a4a;
      cursor: pointer;
    }

    .remember-me input[type="checkbox"] {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      border: 1.5px solid #e1e5eb;
      cursor: pointer;
    }

    .forgot-password {
      color: #2196F3;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .forgot-password:hover {
      color: #1976D2;
      text-decoration: underline;
    }

    .error-message {
      background: #fff5f5;
      color: #dc3545;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .login-btn {
      width: 100%;
      padding: 0.875rem;
      background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .login-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
    }

    .login-btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .login-btn:disabled {
      background: #e1e5eb;
      cursor: not-allowed;
    }

    .login-btn.loading {
      cursor: wait;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 480px) {
      .login-box {
        padding: 1.5rem;
        margin: 1rem;
      }

      .form-options {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }
    }
  `]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        // Navigation is handled by the auth service based on user role
      },
      error: (errorMessage: string) => {
        console.error('Login error:', errorMessage);
        this.errorMessage = errorMessage;
        this.isLoading = false;
      }
    });
  }
}