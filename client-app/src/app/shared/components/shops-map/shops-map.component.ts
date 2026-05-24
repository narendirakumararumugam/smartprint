import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { Shop } from '../../../models/shop.model';
import { LocationService } from '../../../core/services/location.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-shops-map',
  standalone: true,
  imports: [],
  templateUrl: './shops-map.component.html',
  styleUrl: './shops-map.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopsMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainerRef?: ElementRef<HTMLDivElement>;
  @Input() shops: Shop[] = [];
  @Input() height = '480px';
  @Output() shopSelected = new EventEmitter<Shop>();

  private map?: import('leaflet').Map;
  private markers: import('leaflet').Marker[] = [];
  private userMarker?: import('leaflet').Marker;
  private L?: typeof import('leaflet');
  private initialized = false;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly locationService = inject(LocationService);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => this.initMap(), 80);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shops'] && this.initialized) {
      this.renderMarkers();
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private async initMap(): Promise<void> {
    if (!this.mapContainerRef?.nativeElement) return;
    const L = await import('leaflet');
    this.L = L;

    const withCoords = this.shops.filter(s => s.latitude != null && s.longitude != null);
    const center: [number, number] = withCoords.length
      ? [withCoords[0].latitude!, withCoords[0].longitude!]
      : [28.6315, 77.2167];

    this.map = L.map(this.mapContainerRef.nativeElement, { center, zoom: 12 });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);

    this.initialized = true;
    this.renderMarkers();

    // Show user location if available
    const loc = this.locationService.currentLocation;
    if (loc?.coordinates) {
      this.addUserMarker(loc.coordinates.lat, loc.coordinates.lng);
    }
  }

  private renderMarkers(): void {
    if (!this.map || !this.L) return;

    // Clear existing
    this.markers.forEach(m => m.remove());
    this.markers = [];

    const L = this.L;
    const bounds: [number, number][] = [];

    this.shops.forEach(shop => {
      if (shop.latitude == null || shop.longitude == null) return;
      const icon = L.divIcon({
        className: '',
        html: `<div class="shop-pin ${shop.isOpen ? 'open' : 'closed'}">
                 <span class="shop-pin-icon">${shop.icon || '🏪'}</span>
               </div>`,
        iconSize: [40, 48],
        iconAnchor: [20, 48],
      });

      const marker = L.marker([shop.latitude, shop.longitude], { icon }).addTo(this.map!);
      
      const popup = `
        <div class="shop-popup">
          <div class="sp-name">${shop.name}</div>
          <div class="sp-meta">⭐ ${shop.rating} • ${shop.distance}</div>
          <div class="sp-status ${shop.isOpen ? 'open' : 'closed'}">${shop.isOpen ? 'Open now' : 'Closed'}</div>
        </div>`;

      marker.bindPopup(popup);
      marker.on('click', () => this.shopSelected.emit(shop));
      this.markers.push(marker);
      bounds.push([shop.latitude, shop.longitude]);
    });

    if (bounds.length > 1) {
      this.map.fitBounds(bounds, { padding: [40, 40] });
    } else if (bounds.length === 1) {
      this.map.setView(bounds[0], 14);
    }
  }

  private addUserMarker(Lat: number, Lng: number): void {
    if (!this.map || !this.L) return;
    const userIcon = this.L.divIcon({
      className: '',
      html: `<div class="user-marker"><div class="pulse"></div><div class="dot"></div></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    this.userMarker = this.L.marker([Lat, Lng], { icon: userIcon }).addTo(this.map);
    this.userMarker.bindPopup('<strong>You are here</strong>');
  }
}
