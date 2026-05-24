export interface Coordinates {
  lat: number;
  lng: number;
}

export interface UserLocation {
  coordinates: Coordinates;
  /** Short 1-2 part label shown in the header */
  shortAddress: string;
  /** Full reverse-geocoded display name */
  fullAddress: string;
  city?: string;
  state?: string;
  pincode?: string;
}

/** Shape returned by Nominatim /search and /reverse endpoints */
export interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    road?: string;
    suburb?: string;
    neighbourhood?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    postcode?: string;
    [key: string]: string | undefined;
  };
}