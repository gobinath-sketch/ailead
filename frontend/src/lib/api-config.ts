/**
 * CENTRAL API CONFIGURATION
 * Matches the Server Team's architecture exactly.
 */

// Dynamic Resolution Logic
const getBaseUrl = () => {
  if (typeof window === "undefined") return "http://localhost:4000";

  const fallbackBase = `${window.location.protocol}//${window.location.hostname}:4000`;
  const serverApiUrl = 'https://project.globalknowledgetech.com:5006';
  const envBase = (process.env.NEXT_PUBLIC_API_BASE_URL || '').trim();
  const isProductionHost = window.location.hostname === 'project.globalknowledgetech.com';

  return envBase || (isProductionHost ? serverApiUrl : fallbackBase);
};

export const API_BASE = getBaseUrl();
export const SOCKET_URL = API_BASE;

/**
 * CENTRAL ENDPOINT REGISTRY
 * Using relative paths as per server team's standard.
 */
export const API_ENDPOINTS = {
  registrations: {
    root: '/registrations',
    order: '/registrations/order',
  },
  payments: {
    createOrder: '/payments/create-order',
    verify: '/payments/verify',
  },
  community: {
    lead: '/community/lead',
  }
};

/**
 * Path Resolvers
 */
export const apiUrl = (path: string) => `${API_BASE}${path}`;
export const uploadUrl = (relativePath = '') => `${API_BASE}/${String(relativePath).replace(/^\/+/, '')}`;
