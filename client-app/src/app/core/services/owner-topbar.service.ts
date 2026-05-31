import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OwnerTopbarService {
  readonly actionsTemplate$ = new BehaviorSubject<TemplateRef<unknown> | null>(null);
  readonly shopOpen$ = new BehaviorSubject<boolean>(true);
  readonly shopClosesAt$ = new BehaviorSubject<string>('');
  readonly pendingOrders$ = new BehaviorSubject<number>(0);

  setActions(tpl: TemplateRef<unknown> | null): void {
    this.actionsTemplate$.next(tpl);
  }

  clearActions(): void {
    this.actionsTemplate$.next(null);
  }

  setShopOpen(open: boolean): void {
    this.shopOpen$.next(open);
  }

  setShopClosesAt(time: string): void {
    this.shopClosesAt$.next(time);
  }

  setPendingOrders(n: number): void {
    this.pendingOrders$.next(n);
  }
}