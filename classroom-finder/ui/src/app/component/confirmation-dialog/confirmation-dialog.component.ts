import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ConfirmationService, ConfirmationData } from '../../services/confirmation.service';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="confirmationData" class="confirmation-overlay" (click)="onOverlayClick($event)">
      <div class="confirmation-dialog" [class]="'confirmation-' + confirmationData.type">
        <div class="confirmation-header">
          <div class="confirmation-icon">
            <span *ngIf="confirmationData.type === 'warning'">⚠️</span>
            <span *ngIf="confirmationData.type === 'danger'">🗑️</span>
            <span *ngIf="confirmationData.type === 'info'">ℹ️</span>
          </div>
          <h3 class="confirmation-title">{{ confirmationData.title }}</h3>
        </div>
        
        <div class="confirmation-body">
          <p class="confirmation-message">{{ confirmationData.message }}</p>
        </div>
        
        <div class="confirmation-actions">
          <button 
            class="btn btn-cancel" 
            (click)="onCancel()"
            type="button"
          >
            {{ confirmationData.cancelText }}
          </button>
          <button 
            class="btn btn-confirm" 
            [class.btn-danger]="confirmationData.type === 'danger'"
            [class.btn-warning]="confirmationData.type === 'warning'"
            [class.btn-info]="confirmationData.type === 'info'"
            (click)="onConfirm()"
            type="button"
          >
            {{ confirmationData.confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .confirmation-dialog {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      min-width: 400px;
      max-width: 500px;
      overflow: hidden;
      animation: slideIn 0.3s ease-out;
      margin: 20px;
    }

    @keyframes slideIn {
      from {
        transform: translateY(-20px) scale(0.95);
        opacity: 0;
      }
      to {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }

    .confirmation-header {
      padding: 24px 24px 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .confirmation-icon {
      font-size: 24px;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .confirmation-warning .confirmation-icon {
      background: #fef3cd;
      color: #f59e0b;
    }

    .confirmation-danger .confirmation-icon {
      background: #fee2e2;
      color: #ef4444;
    }

    .confirmation-info .confirmation-icon {
      background: #dbeafe;
      color: #3b82f6;
    }

    .confirmation-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }

    .confirmation-body {
      padding: 16px 24px 24px;
    }

    .confirmation-message {
      margin: 0;
      color: #6b7280;
      line-height: 1.5;
    }

    .confirmation-actions {
      padding: 16px 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 14px;
      min-width: 80px;
    }

    .btn:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    .btn-cancel {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-cancel:hover {
      background: #e5e7eb;
    }

    .btn-confirm {
      background: #3b82f6;
      color: white;
    }

    .btn-confirm:hover {
      background: #2563eb;
    }

    .btn-danger {
      background: #ef4444;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .btn-warning {
      background: #f59e0b;
    }

    .btn-warning:hover {
      background: #d97706;
    }

    .btn-info {
      background: #3b82f6;
    }

    .btn-info:hover {
      background: #2563eb;
    }

    @media (max-width: 480px) {
      .confirmation-dialog {
        min-width: 90vw;
        margin: 10px;
      }

      .confirmation-actions {
        flex-direction: column-reverse;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class ConfirmationDialogComponent implements OnInit, OnDestroy {
  confirmationData: ConfirmationData | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.confirmationService.confirmation$.subscribe(data => {
        this.confirmationData = data;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onConfirm(): void {
    this.confirmationService.confirmResult(true);
  }

  onCancel(): void {
    this.confirmationService.confirmResult(false);
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
