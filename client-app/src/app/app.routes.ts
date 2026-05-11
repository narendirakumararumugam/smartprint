import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { ShopSearchComponent } from './features/shops/shop-search/shop-search.component';
import { OrdersComponent } from './features/orders/orders/orders.component';
import { AuthLayoutComponent } from './features/auth/auth-layout/auth-layout.component';
import { UploadPrintComponent } from './features/print/upload-print/upload-print.component';

export const routes: Routes = [
  //   { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'auth', component: AuthLayoutComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // {
      //   path: '',
      //   pathMatch: 'full',
      //   redirectTo: 'search-shops',
      // },
      {
        path: 'search-shops',
        component: ShopSearchComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'print',
        component: UploadPrintComponent,
      }
    ],
  },
];
