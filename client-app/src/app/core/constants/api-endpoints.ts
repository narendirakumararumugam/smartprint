export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'login',
    SIGNUP: 'signup',
    FORGOT_PASSWORD: 'forgot-password',
    REFRESH: 'refresh',
    ME: 'me',
  },
  OWNER_AUTH: {
    REGISTER: 'register',
    CHECK_EMAIL: 'check-email',
  },
  ORDERS: {
    LIST: '',
    CREATE: '',
    DETAIL: (id: string | number) => `${id}`,
    CANCEL: (id: string | number) => `${id}/cancel`,
    CONFIRM_PICKUP: (id: string | number) => `${id}/confirm-pickup`,
  },
  OWNER_ORDERS: {
    LIST: '',
    UPDATE_STATUS: (id: string | number) => `${id}/status`,
  },
  PRINTERS: {
    LIST: '',
    STATS: 'stats',
    CREATE: '',
    UPDATE: (id: number) => `${id}`,
    DELETE: (id: number) => `${id}`,
    SET_DEFAULT: (id: number) => `${id}/set-default`,
    TEST_PRINT: (id: number) => `${id}/test-print`,
    JOBS: 'jobs',
    QUEUE: (id: number) => `${id}/queue`,
  },
  PROFILE: {
    GET: '',
    UPDATE: '',
  },
  SHOPS: {
    LIST: '',
    DETAIL: (id: number) => `${id}`,
    REVIEWS: (id: number) => `${id}/reviews`,
    SAVED: 'saved',
    SAVE: (id: number) => `${id}/save`,
    IS_SAVED: (id: number) => `${id}/saved`,
    COLLECTIONS: 'collections',
  },
  OWNER_DASHBOARD: {
    STATS: 'stats',
  },
  ADMIN: {
    STATS: 'stats',
    USERS: 'users',
    USER_STATUS: (id: string) => `users/${id}/status`,
    SHOPS: 'shops',
    SHOP_VERIFY: (id: number) => `shops/${id}/verify`,
    ORDERS: 'orders',
  },
} as const;

export const RESOURCE_PATHS = {
  AUTH: 'auth',
  OWNER_AUTH: 'owner/auth',
  ORDERS: 'orders',
  OWNER_ORDERS: 'owner/orders',
  PRINTERS: 'owner/printers',
  PROFILE: 'profile',
  SHOPS: 'shops',
  PUBLIC_SHOPS: 'public/shops',
  OWNER_DASHBOARD: 'owner/dashboard',
  ADMIN: 'admin',
} as const;