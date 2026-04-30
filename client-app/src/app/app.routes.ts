import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { LoginComponent } from './features/login/login.component';
import { ShopSearchComponent } from './features/shops/shop-search/shop-search.component';
import { OrdersComponent } from './features/orders/orders/orders.component';

export const routes: Routes = [
//   { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', 
    component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'search-shops'
      },
      {
        path: 'search-shops',
        component: ShopSearchComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent
      }
    ],
  },
];
