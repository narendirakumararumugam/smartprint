import { inject, PLATFORM_ID, OnDestroy, Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { Client, StompSubscription, IMessage } from '@stomp/stompjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroy$ = new Subject<void>();
  private readonly connected$ = new BehaviorSubject<boolean>(false);

  readonly isConnected$ = this.connected$.asObservable();

  private client: Client | null = null;

  // — Connection lifecycle ————————————————————————————————————————————

  connect(): void {
    if (!this.isBrowser) return;
    if (this.client?.active) return; // Already connected or connecting

    const wsUrl = environment.wsBaseUrl
      ? `${environment.wsBaseUrl}/ws`
      : `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`;

    this.client = new Client({
      // Use native WebSocket – no SockJS dependency needed for modern browsers
      webSocketFactory: () => new WebSocket(wsUrl),
      // Reconnect automatically after 5 s on unexpected disconnect
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        this.connected$.next(true);
      },
      onDisconnect: () => {
        this.connected$.next(false);
      },
      onStompError: (frame) => {
        console.error('[WS] STOMP error:', frame.headers['message']);
      },
      onWebSocketError: (event) => {
        console.warn('[WS] WebSocket error:', event);
      }
    });

    this.client.activate();
  }

  disconnect(): void {
    if (!this.isBrowser) return;
    this.client?.deactivate();
    this.connected$.next(false);
  }

  // — Subscription ————————————————————————————————————————————————————

  /**
   * Returns an Observable that:
   * - Waits until the STOMP connection is established.
   * - Creates a STOMP subscription to the given topic.
   * - Automatically re-subscribes after a reconnect.
   * - Unsubscribes when the caller unsubscribes or the service is destroyed.
   * * Works for both broadcast topics (/topic/...) and user queues (/user/queue/...).
   */
  watch<T>(topic: string): Observable<T> {
    return this.connected$.pipe(
      filter(connected => connected),
      switchMap(() => 
        new Observable<T>((observer) => {
          let sub: StompSubscription | null = null;
          try {
            sub = this.client!.subscribe(topic, (msg: IMessage) => {
              try {
                observer.next(JSON.parse(msg.body) as T);
              } catch {
                console.error('[WS] Failed to parse message on', topic, msg.body);
              }
            });
          } catch (e) {
            observer.error(e);
          }

          // Cleanup: unsubscribe from STOMP when the inner observable tears down
          return () => {
            try { sub?.unsubscribe(); } catch { /* ignore */ }
          };
        })
      ),
      takeUntil(this.destroy$)
    );
  }

  // — Lifecycle ———————————————————————————————————————————————————————

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }
}