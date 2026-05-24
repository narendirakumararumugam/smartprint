import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Coordinates, NominatimResult, UserLocation } from '../../../models/location.model';
import { LocationService } from '../../../core/services/location.service';
import { GeocodingService } from '../../../core/services/geocoding.service';

@Component({
    selector: 'app-inline-map-picker',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './inline-map-picker.component.html',
    styleUrl: './inline-map-picker.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineMapPickerComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('mapContainer') mapContainerRef!: ElementRef<HTMLDivElement>;

    /** Initial map center if no pin chosen yet */
    @Input() initialCenter: Coordinates = { lat: 26.1445, lng: 91.7362 }; // Guwahati (NE India default)
    @Input() initialZoom = 13;
    @Input() height = '320px';
    @Input() pinned: Coordinates | null = null;

    @Output() locationPicked = new EventEmitter<UserLocation>();

    searchQuery = '';
    suggestions: NominatimResult[] = [];
    isSearching = false;
    detectError = '';
    isLoadingAddress = false;
    currentAddress = '';

    private map?: import('leaflet').Map;
    private marker?: import('leaflet').Marker;
    private L?: typeof import('leaflet');

    get hasPin(): boolean { return !!this.marker; }
    private readonly destroy$ = new Subject<void>();
    private readonly search$ = new Subject<string>();
    private readonly platformId = inject(PLATFORM_ID);
    private readonly locationService = inject(LocationService);
    private readonly geocodingService = inject(GeocodingService);
    private readonly cdr = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.search$
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(q => {
                    if (q.length < 3) {
                        this.suggestions = [];
                        this.isSearching = false;
                        this.cdr.markForCheck();
                        return of([] as NominatimResult[]);
                    }
                    this.isSearching = true;
                    this.cdr.markForCheck();
                    return this.geocodingService.searchAddress(q);
                }),
                takeUntil(this.destroy$),
            )
            .subscribe({
                next: results => {
                    this.suggestions = results;
                    this.isSearching = false;
                    this.cdr.markForCheck();
                },
                error: () => {
                    this.isSearching = false;
                    this.cdr.markForCheck();
                },
            });
    }

    ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        setTimeout(() => this.initMap(this.pinned ?? this.initialCenter, !!this.pinned), 80);
    }

    onSearchInput(): void {
        this.search$.next(this.searchQuery);
    }

    selectSuggestion(result: NominatimResult): void {
        const coords: Coordinates = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
        this.suggestions = [];
        this.searchQuery = '';
        this.moveTo(coords);
    }

    detectCurrentLocation(): void {
        this.detectError = '';
        this.cdr.markForCheck();
        this.locationService
            .requestCurrentPosition()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: pos => this.moveTo({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                error: (err: GeolocationPositionError) => {
                    this.detectError = this.geoErrorMessage(err);
                    this.cdr.markForCheck();
                },
            });
    }

    private async initMap(coords: Coordinates, dropPin: boolean): Promise<void> {
        if (!this.mapContainerRef?.nativeElement) return;
        const L = await import('leaflet');
        this.L = L;

        this.map = L.map(this.mapContainerRef.nativeElement, {
            center: [coords.lat, coords.lng],
            zoom: this.initialZoom,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(this.map);

        if (dropPin) {
            this.placeMarker(coords);
            this.fetchAddress(coords);
        }

        // Click map to drop / move the pin
        this.map.on('click', (e: import('leaflet').LeafletMouseEvent) => {
            const c = { lat: e.latlng.lat, lng: e.latlng.lng };
            if (!this.marker) this.placeMarker(c);
            else this.marker.setLatLng(c);
            this.fetchAddress(c);
        });
    }

    private placeMarker(coords: Coordinates): void {
        if (!this.map || !this.L) return;
        const pinIcon = this.L.divIcon({
            className: '',
            html: `<div class="map-pin-icon"><div class="pin-body"></div><div class="pin-tip"></div></div>`,
            iconSize: [40, 50],
            iconAnchor: [20, 50],
        });

        this.marker = this.L.marker([coords.lat, coords.lng], { icon: pinIcon, draggable: true }).addTo(this.map);
        this.marker.on('dragend', (e: import('leaflet').LeafletEvent) => {
            const latlng = (e.target as import('leaflet').Marker).getLatLng();
            this.fetchAddress({ lat: latlng.lat, lng: latlng.lng });
        });
    }

    private moveTo(coords: Coordinates): void {
        if (!this.map) return;
        this.map.setView([coords.lat, coords.lng], 16);
        if (!this.marker) this.placeMarker(coords);
        else this.marker.setLatLng([coords.lat, coords.lng]);
        this.fetchAddress(coords);
    }

    private fetchAddress(coords: Coordinates): void {
        this.isLoadingAddress = true;
        this.cdr.markForCheck();
        this.geocodingService
            .reverseGeocode(coords)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: loc => {
                    this.currentAddress = loc.fullAddress;
                    this.isLoadingAddress = false;
                    this.locationPicked.emit(loc);
                    this.cdr.markForCheck();
                },
                error: () => {
                    const loc: UserLocation = {
                        coordinates: coords,
                        shortAddress: `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`,
                        fullAddress: 'Address details unavailable',
                    };
                    this.currentAddress = loc.fullAddress;
                    this.isLoadingAddress = false;
                    this.locationPicked.emit(loc);
                    this.cdr.markForCheck();
                },
            });
    }

    private geoErrorMessage(err: GeolocationPositionError | { code: number }): string {
        switch (err.code) {
            case 1: return 'Location permission denied. Please enable it in browser settings.';
            case 2: return 'Position unavailable. Try searching manually.';
            case 3: return 'Location request timed out. Try again.';
            default: return 'Could not get location. Try searching manually.';
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.map?.remove();
        this.map = undefined;
        this.marker = undefined;
    }
}