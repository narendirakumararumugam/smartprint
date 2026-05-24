import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Output } from "@angular/core";
import { InlineMapPickerComponent } from "../inline-map-picker/inline-map-picker.component";
import { UserLocation } from "../../../models/location.model";
import { LocationService } from "../../../core/services/location.service";

@Component({
  selector: 'app-location-picker',
  standalone: true,
  imports: [CommonModule, InlineMapPickerComponent],
  templateUrl: './location-picker.component.html',
  styleUrl: './location-picker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationPickerComponent {
  @Output() locationConfirmed = new EventEmitter<UserLocation>();
  @Output() closed = new EventEmitter<void>();

  pendingLocation: UserLocation | null = null;

  private readonly locationService = inject(LocationService);
  private readonly cdr = inject(ChangeDetectorRef);

  /** Initial map center – uses last known location or Connaught Place fallback. */
  get initialCenter(): { lat: number; lng: number } {
    const loc = this.locationService.currentLocation;
    return loc?.coordinates ?? { lat: 28.6315, lng: 77.2167 };
  }

  onLocationPicked(loc: UserLocation): void {
    this.pendingLocation = loc;
    this.cdr.markForCheck();
  }

  confirm(): void {
    if (!this.pendingLocation) return;
    this.locationService.setLocation(this.pendingLocation);
    this.locationConfirmed.emit(this.pendingLocation);
    this.closed.emit();
  }

  close(): void{
    this.closed.emit();
  }
}