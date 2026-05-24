import { ShopDetails } from "../../models/shops/shop-details";

export const DEFAULT_SHOP_DETAILS: ShopDetails = {
  id: 0,
  name: '',

  isVerified: false,
  isFavourite: false,

  // 📍 Location
  address: '',
  city: '',
  latitude: 0,
  longitude: 0,
  distance: 0,

  // ⭐ Ratings
  rating: 0,
  totalReviews: 0,

  // ⏱️ Operational
  isOpen: false,
  waitTime: 0,

  workingHours: [],

  // 📝 About
  about: '',

  // 🛠️ Services
  services: [],

  // 💰 Pricing
  pricing: [],

  // 🖼️ Media
  coverImage: '',
  logo: '',
  gallery: [],

  // 📞 Contact
  phone: '',
  email: '',

  // 🧠 UX Tags
  tags: [],

  // 💸 Starting price
  fromCost: 0,
};