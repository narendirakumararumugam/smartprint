import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { filter, map } from 'rxjs';
import { LocationPickerComponent } from "./shared/components/location-picker/location-picker.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, LocationPickerComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly router = inject(Router);
  isLocationPickerOpen = false;
  showNavSearch = false;

  hideNavbar$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    map(e => ['/login', '/signup'].includes(e.urlAfterRedirects) || e.urlAfterRedirects.startsWith('/owner') || 
    e.urlAfterRedirects.startsWith('/admin')),
  );
}
