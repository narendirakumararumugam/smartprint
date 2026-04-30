export interface PrinterShop {
  id: string;
  name: string;
  rating: number;
  distance: string;
  estimatedTime: string;
  specialties: string[];
  isOpen: boolean;
  imageUrl: string;
  priceLevel: string; // e.g., '$', '$$'
}
