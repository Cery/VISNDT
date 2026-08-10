export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const REFRESH_PATH = '/auth/refresh';

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
  DASHBOARD: '/workspace/dashboard',
  WORKSPACE: '/workspace',
} as const;
