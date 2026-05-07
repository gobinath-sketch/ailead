/**
 * CENTRAL API CONFIGURATION
 * MASTER SWITCH: Toggle between Local and Production environments.
 */

// 🟢 SET TO 'true' to force the site to use the Server Backend
// 🔴 SET TO 'false' for normal Local Development
const FORCE_PRODUCTION = false; 

const getBaseUrl = () => {
  if (typeof window === "undefined") return "http://localhost:4000";

  // Check if there is a manual override in the URL (e.g., ?api=http://localhost:4000)
  const urlParams = new URLSearchParams(window.location.search);
  const manualOverride = urlParams.get('api');
  if (manualOverride) {
    console.log("🛠️ API MODE: MANUAL OVERRIDE ->", manualOverride);
    return manualOverride;
  }

  // PROD CONFIG
  const serverBase = 'http://project.globalknowledgetech.com:4000';
  
  // LOCAL CONFIG
  const localBase = `${window.location.protocol}//${window.location.hostname}:4000`;
  
  // SMART DETECTION: Check if we are on the global knowledge tech domain
  const hostname = window.location.hostname;
  const isProductionHost = hostname.includes('globalknowledgetech.com');
  
  if (FORCE_PRODUCTION || isProductionHost) {
    console.log("🚀 API MODE: PRODUCTION (Server) ->", serverBase);
    return serverBase;
  }

  console.log("💻 API MODE: LOCAL (Development) ->", localBase);
  return localBase;
};

export const API_BASE = getBaseUrl();
export const SOCKET_URL = API_BASE;

/**
 * CENTRAL ENDPOINT REGISTRY
 */
export const API_ENDPOINTS = {
  registrations: {
    root: '/registrations',
    order: '/registrations/order',
    byEmail: '/registrations/by-email',
  },
  payments: {
    createOrder: '/payments/create-order',
    verify: '/payments/verify',
  },
  community: {
    lead: '/community/lead',
  },
  auth: {
    sendOtp: '/auth/send-otp',
    verifyOtp: '/auth/verify-otp',
    loginOtp: '/auth/login-otp',
    login: '/auth/login',
    updatePassword: '/auth/update-password',
  },
  lms: {
    courses: '/lms/courses',
    chapters: (courseId: string) => `/lms/courses/${courseId}/chapters`,
    lessons: (chapterId: string) => `/lms/chapters/${chapterId}/lessons`,
    prompts: '/lms/prompts',
    progress: '/lms/progress',
    userProgress: (userId: string) => `/lms/progress/${userId}`,
    courseProgress: (userId: string, courseId: string) => `/lms/progress/${userId}/course/${courseId}`,
    events: '/lms/events',
    stats: '/lms/stats/dashboard',
    enroll: '/lms/enroll',
  }
};

/**
 * Path Resolvers
 */
export const apiUrl = (path: string) => `${API_BASE}${path}`;
export const uploadUrl = (relativePath = '') => `${API_BASE}/${String(relativePath).replace(/^\/+/, '')}`;
