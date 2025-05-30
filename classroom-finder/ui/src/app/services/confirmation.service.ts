import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmationData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

export interface ConfirmationResult {
  id: string;
  confirmed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private confirmationSubject = new BehaviorSubject<ConfirmationData | null>(null);
  private resultSubject = new BehaviorSubject<ConfirmationResult | null>(null);

  confirmation$ = this.confirmationSubject.asObservable();
  result$ = this.resultSubject.asObservable();

  private currentId: string = '';

  constructor() {}

  confirm(data: ConfirmationData): Promise<boolean> {
    this.currentId = this.generateId();
    this.confirmationSubject.next({
      ...data,
      confirmText: data.confirmText || 'Confirm',
      cancelText: data.cancelText || 'Cancel',
      type: data.type || 'warning'
    });

    return new Promise((resolve) => {
      const subscription = this.result$.subscribe((result) => {
        if (result && result.id === this.currentId) {
          subscription.unsubscribe();
          resolve(result.confirmed);
          this.clearConfirmation();
        }
      });
    });
  }

  confirmResult(confirmed: boolean): void {
    this.resultSubject.next({
      id: this.currentId,
      confirmed
    });
  }

  clearConfirmation(): void {
    this.confirmationSubject.next(null);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
