export interface PrintShop {
  id: number;
  name: string;
  addr: string;
  dist: string;
  rating: number;
  isOpen: boolean;
  wait: string;
  grad: string;
  icon: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
}

export interface PrintAddon {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export interface UploadedFile {
  id: number;
  name: string;
  size: string;
  pages: number;
  ext: string;
  color: boolean;
  sides: 'single' | 'double';
  copies: number;
  sizeP: string;
  prog: number;
}

export interface ConfettiPiece {
  left: number;
  bg: string;
  size: number;
  radius: string;
  delay: number;
  duration: number;
}

export const PRINT_SHOPS: PrintShop[] = [
  {
    id: 0,
    name: 'PrintPro Express',
    addr: 'F-Block, Connaught Place',
    dist: '0.3 km',
    rating: 4.8,
    isOpen: true,
    wait: '~5 min',
    grad: 'linear-gradient(135deg,#1e3a8a,#2563eb)',
    icon: '⚡',
    badge: 'Top Rated',
    badgeBg: '#dbeafe',
    badgeColor: '#1d4ed8',
  },
  {
    id: 1,
    name: 'QuickPrint Hub',
    addr: 'Janpath Market',
    dist: '0.6 km',
    rating: 4.5,
    isOpen: true,
    wait: '~10 min',
    grad: 'linear-gradient(135deg,#d97706,#fbbf24)',
    icon: '⚡',
    badge: 'Fast',
    badgeBg: '#fef3c7',
    badgeColor: '#92400e',
  },
  {
    id: 2,
    name: 'Digital Café & Print',
    addr: 'Palika Bazaar',
    dist: '1.2 km',
    rating: 4.3,
    isOpen: true,
    wait: '~15 min',
    grad: 'linear-gradient(135deg,#be185d,#ec4899)',
    icon: '☕',
    badge: 'Café Inside',
    badgeBg: '#fce7f3',
    badgeColor: '#9d174d',
  },
  {
    id: 3,
    name: 'Campus Prints',
    addr: 'GTB Nagar, N. Campus',
    dist: '0.5 km',
    rating: 4.6,
    isOpen: true,
    wait: '~8 min',
    grad: 'linear-gradient(135deg,#059669,#34d399)',
    icon: '🎓',
    badge: 'Student Discount',
    badgeBg: '#d1fae5',
    badgeColor: '#065f46',
  },
  {
    id: 4,
    name: 'Xerox World',
    addr: 'Nehru Place, G.F.',
    dist: '0.8 km',
    rating: 4.7,
    isOpen: true,
    wait: '~20 min',
    grad: 'linear-gradient(135deg,#7c3aed,#a855f7)',
    icon: '📄',
    badge: 'Large Format',
    badgeBg: '#ede9fe',
    badgeColor: '#5b21b6',
  },
  {
    id: 5,
    name: 'City Print Center',
    addr: 'Old Delhi Railway Stn.',
    dist: '1.8 km',
    rating: 4.1,
    isOpen: false,
    wait: '~5 min',
    grad: 'linear-gradient(135deg,#0f766e,#14b8a6)',
    icon: '🏢',
    badge: 'Budget',
    badgeBg: '#d1fae5',
    badgeColor: '#065f46',
  },
];

export const PRINT_ADDONS: PrintAddon[] = [
  { id: 'spiral', name: 'Spiral Binding', price: 30, icon: '🔗' },
  { id: 'hard', name: 'Hard Binding', price: 180, icon: '📘' },
  { id: 'lam-a4', name: 'Lamination A4', price: 15, icon: '✨' },
  { id: 'lam-a3', name: 'Lamination A3', price: 25, icon: '✨' },
  { id: 'scan', name: 'Scanning', price: 5, icon: '🔍' },
  { id: 'photo-4x6', name: 'Photo print 4x6', price: 15, icon: '🖼️' },
];
