export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const AUTH_TOKEN_KEY = 'visndt_token';
export const AUTH_USER_KEY = 'visndt_user';

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  SOLUTIONS: '/solutions',
  KNOWLEDGE: '/knowledge',
  BUSINESS: '/business',
  ABOUT: '/about',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  WORKSPACE: '/workspace',
} as const;