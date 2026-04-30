import { MenuItem } from "../models/menu-details";

export const MENU_CONFIG: MenuItem[] = [

  // ================= USER =================
  {
    label: 'Shops',
    icon: 'bx bx-store',
    route: '/search-shops',
    role: 'USER'
  },
  {
    label: 'Orders',
    icon: 'bx bx-list-ul-square',
    route: '/orders',
    role: 'USER'
  },
  {
    label: 'Upload & Print',
    icon: 'bx bx-arrow-up-circle',
    route: '/upload',
    role: 'USER'
  },

  // ================= SHOP OWNER =================
  {
    label: 'Dashboard',
    icon: 'bx bx-home-circle',
    route: '/app/shop/dashboard',
    role: 'SHOP'
  },
  {
    label: 'Incoming Orders',
    icon: 'bx bx-inbox',
    role: 'SHOP',
    children: [
      {
        label: 'New Requests',
        route: '/app/shop/orders/new'
      },
      {
        label: 'Accepted',
        route: '/app/shop/orders/accepted'
      },
      {
        label: 'Printing',
        route: '/app/shop/orders/printing'
      },
      {
        label: 'Completed',
        route: '/app/shop/orders/completed'
      }
    ]
  },
  {
    label: 'Shop Management',
    icon: 'bx bx-store-alt',
    role: 'SHOP',
    children: [
      {
        label: 'My Shop',
        route: '/app/shop/profile'
      },
      {
        label: 'Working Hours',
        route: '/app/shop/hours'
      }
    ]
  },
  {
    label: 'Pricing',
    icon: 'bx bx-rupee',
    route: '/app/shop/pricing',
    role: 'SHOP'
  },
  {
    label: 'Earnings',
    icon: 'bx bx-line-chart',
    route: '/app/shop/earnings',
    role: 'SHOP'
  },
  {
    label: 'Settings',
    icon: 'bx bx-cog',
    route: '/app/shop/settings',
    role: 'SHOP'
  },

  // ================= ADMIN =================
  {
    label: 'Dashboard',
    icon: 'bx bx-grid',
    route: '/app/admin/dashboard',
    role: 'ADMIN'
  },
  {
    label: 'Users Management',
    icon: 'bx bx-user',
    role: 'ADMIN',
    children: [
      {
        label: 'All Users',
        route: '/app/admin/users'
      },
      {
        label: 'Shop Owners',
        route: '/app/admin/shop-owners'
      }
    ]
  },
  {
    label: 'Shops Management',
    icon: 'bx bx-store',
    route: '/app/admin/shops',
    role: 'ADMIN'
  },
  {
    label: 'Orders Management',
    icon: 'bx bx-package',
    role: 'ADMIN',
    children: [
      {
        label: 'All Orders',
        route: '/app/admin/orders'
      },
      {
        label: 'Active Orders',
        route: '/app/admin/orders/active'
      }
    ]
  },
  {
    label: 'Reports & Analytics',
    icon: 'bx bx-bar-chart-alt',
    route: '/app/admin/reports',
    role: 'ADMIN'
  },
  {
    label: 'Settings',
    icon: 'bx bx-cog',
    route: '/app/admin/settings',
    role: 'ADMIN'
  }
];