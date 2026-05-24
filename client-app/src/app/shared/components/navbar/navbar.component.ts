import { 
  Component, 
  EventEmitter, 
  Input, 
  Output, 
  ChangeDetectionStrategy, 
  inject 
} from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocationService } from '../../../core/services/location.service';
import { ShopService } from '../../../core/services/shop.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  @Input() showSearch = false;
  @Output() openLocationPicker = new EventEmitter<void>();

  readonly locationService = inject(LocationService);
  private readonly shopService = inject(ShopService);

  onSearch(value: string): void {
    this.shopService.setSearch(value);
  }
}