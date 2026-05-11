import { Pricing } from "./shop-details-pricing";
import { Tag } from "./shop-details-tag";
import { WorkingHour } from "./shop-details-working-hour";

export interface ShopDetails {
  id: number;
  name: string;

  isVerified: boolean;
  isFavourite: boolean;

  // 📍 Location
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  distance: number; // in KM

  // ⭐ Ratings
  rating: number;
  totalReviews: number;

  // ⏱️ Operational
  isOpen: boolean;
  waitTime: number; // in minutes
  workingHours: WorkingHour[];

  // 📝 About
  about: string;

  // 🛠️ Services
  services: string[];

  // 💰 Pricing
  pricing: Pricing[];

  // 🖼️ Media
  coverImage: string;
  logo: string;
  gallery: string[];

  // 📞 Contact
  phone: string;
  email: string;

  // 🧠 UX Tags
  tags: Tag[];

  fromCost: number; // Starting price for services
}