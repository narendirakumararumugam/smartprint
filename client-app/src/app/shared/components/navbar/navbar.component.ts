import { Component } from '@angular/core';
import { MenuItem } from '../../../models/menu-details';
import { MENU_CONFIG } from '../../../config/menu.config';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  userLocation: string = 'Alandur, Chennai';
  activeMenu: string = 'Shops';
  menuItems: MenuItem[] = [];
  userRole: string = 'USER';

  constructor(private _router: Router) {}

  ngOnInit() {
    // Filter menu based on user role
    this.menuItems = MENU_CONFIG.filter((item) => item.role === this.userRole);
  }


  routeTo(routeUrl: string): void {
    this._router.navigateByUrl(routeUrl);
  }
}
