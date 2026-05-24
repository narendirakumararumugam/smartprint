import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastType = 'success' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  private toasts$ = new BehaviorSubject<Toast[]>([]);

  readonly toasts: Observable<Toast[]> = this.toasts$.asObservable();

  show(message: string, type: ToastType = 'info'): void {
    const id = ++this.counter;
    this.toasts$.next([...this.toasts$.value, { id, message, type }]);
    setTimeout(() => this.remove(id), 3200);
  }

  remove(id: number): void {
    this.toasts$.next(this.toasts$.value.filter(t => t.id !== id));
  }
}