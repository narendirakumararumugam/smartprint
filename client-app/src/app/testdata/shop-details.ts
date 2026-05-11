import { ShopDetails } from "../models/shops/shop-details";

export const shopDetailsList: ShopDetails[] = [
  {
    id: 1,
    name: 'PrintPro Express',
    isVerified: true,
    isFavourite: false,

    address: 'T. Nagar Main Road, Chennai, Tamil Nadu 600017',
    city: 'Chennai',
    latitude: 13.0418,
    longitude: 80.2341,
    distance: 2.3,

    rating: 4.8,
    totalReviews: 534,

    isOpen: true,
    waitTime: 5,

    workingHours: [
      { day: 'Monday', open: '9:00 AM', close: '9:00 PM' },
      { day: 'Tuesday', open: '9:00 AM', close: '9:00 PM' },
      { day: 'Wednesday', open: '9:00 AM', close: '9:00 PM' },
      { day: 'Thursday', open: '9:00 AM', close: '9:00 PM' },
      { day: 'Friday', open: '9:00 AM', close: '9:00 PM' },
      { day: 'Saturday', open: '10:00 AM', close: '8:00 PM' },
      { day: 'Sunday', open: 'Closed', close: '' }
    ],

    about:
      'Fast and reliable printing service in T. Nagar. Popular among students and office-goers for quick turnaround.',

    services: [
      'Black & White Print',
      'Color Print',
      'Spiral Binding',
      'Lamination'
    ],

    pricing: [
      { service: 'Print', spec: 'A4 - B&W', price: 2 },
      { service: 'Print', spec: 'A4 - Color', price: 10 },
      { service: 'Spiral Binding', spec: 'Up to 100 pages', price: 40 }
    ],

    coverImage: 'https://picsum.photos/seed/shop1/800/400',
    logo: 'https://picsum.photos/seed/logo1/100',
    gallery: [
      'https://picsum.photos/seed/print1/300',
      'https://picsum.photos/seed/print2/300'
    ],

    phone: '+91 98765 43210',
    email: 'printpro@gmail.com',

    tags: [
      { tagName: 'Fast Service', tagClass: 'p-green' },
      { tagName: 'Top Rated', tagClass: 'p-blue' }
    ],
    fromCost: 1,
  },

  {
    id: 2,
    name: 'QuickPrint Hub',
    isVerified: true,
    isFavourite: true,

    address: 'MG Road, Chennai',
    city: 'Chennai',
    latitude: 13.0569,
    longitude: 80.2425,
    distance: 3.1,

    rating: 4.2,
    totalReviews: 210,

    isOpen: true,
    waitTime: 7,

    workingHours: [
      { day: 'Monday', open: '8:30 AM', close: '8:30 PM' },
      { day: 'Sunday', open: '10:00 AM', close: '6:00 PM' }
    ],

    about:
      'Affordable printing hub near MG Road. Great for quick prints and laminations.',

    services: ['Color Print', 'Lamination', 'Scanning'],

    pricing: [
      { service: 'Print', spec: 'A4 - Color', price: 12 },
      { service: 'Lamination', spec: 'A4', price: 30 }
    ],

    coverImage: 'https://picsum.photos/seed/shop2/800/400',
    logo: 'https://picsum.photos/seed/logo2/100',
    gallery: ['https://picsum.photos/seed/print3/300'],

    phone: '+91 91234 56789',
    email: 'quickprint@gmail.com',

    tags: [
      { tagName: 'Budget Friendly', tagClass: 'p-amber' }
    ],
    fromCost: 1,
  },

  {
    id: 3,
    name: 'Speedy Prints',
    isVerified: false,
    isFavourite: false,

    address: 'Anna Nagar West, Chennai',
    city: 'Chennai',
    latitude: 13.0878,
    longitude: 80.2101,
    distance: 4.5,

    rating: 4.0,
    totalReviews: 120,

    isOpen: false,
    waitTime: 6,

    workingHours: [
      { day: 'Monday', open: '9:00 AM', close: '7:00 PM' },
      { day: 'Sunday', open: 'Closed', close: '' }
    ],

    about:
      'Compact print shop with decent pricing. Best for quick B&W prints.',

    services: ['B&W Print', 'Binding'],

    pricing: [
      { service: 'Print', spec: 'A4 - B&W', price: 1.5 },
      { service: 'Binding', spec: 'Basic', price: 25 }
    ],

    coverImage: 'https://picsum.photos/seed/shop3/800/400',
    logo: 'https://picsum.photos/seed/logo3/100',
    gallery: ['https://picsum.photos/seed/print4/300'],

    phone: '+91 99887 66554',
    email: 'speedy@gmail.com',

    tags: [
      { tagName: 'Low Cost', tagClass: 'p-amber' }
    ],
    fromCost: 2
  },

  {
    id: 4,
    name: 'City Copy Center',
    isVerified: true,
    isFavourite: true,

    address: 'T Nagar Main Street, Chennai',
    city: 'Chennai',
    latitude: 13.039,
    longitude: 80.229,
    distance: 2.0,

    rating: 4.7,
    totalReviews: 410,

    isOpen: true,
    waitTime: 4,

    workingHours: [
      { day: 'Monday', open: '9:00 AM', close: '10:00 PM' }
    ],

    about:
      'Premium printing experience with fast service and excellent quality.',

    services: ['Color Print', 'Binding', 'Lamination'],

    pricing: [
      { service: 'Print', spec: 'A3 - Color', price: 25 },
      { service: 'Binding', spec: 'Spiral', price: 50 }
    ],

    coverImage: 'https://picsum.photos/seed/shop4/800/400',
    logo: 'https://picsum.photos/seed/logo4/100',
    gallery: ['https://picsum.photos/seed/print5/300'],

    phone: '+91 98765 11111',
    email: 'citycopy@gmail.com',

    tags: [
      { tagName: 'Premium', tagClass: 'p-blue' },
      { tagName: 'Top Rated', tagClass: 'p-green' }
    ],
    fromCost: 3
  }
];