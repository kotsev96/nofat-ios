import { supabase } from './supabase';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8028';

// Refresh guards to avoid loops
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function getValidToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

async function refreshToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      console.log('🔄 Refreshing token...');
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error || !session) {
        console.error('❌ Refresh failed:', error);
        await supabase.auth.signOut();
        return null;
      }
      console.log('✅ Token refreshed successfully');
      return session.access_token;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

/**
 * Get the current access token from Supabase session
 */
async function getAccessToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

/**
 * Make an authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<T> {
  const MAX_RETRIES = 1; // only one refresh attempt

  const token = await getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge existing headers
  if (options.headers) {
    const existingHeaders = new Headers(options.headers);
    existingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  if (token) {
    console.log('🔑 Sending request with token:', `${token.substring(0, 12)}...`);
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.log('⚠️ No access token available before request');
  }

  const doFetch = async (authHeader: string | null) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

  let response = await doFetch(token ? `Bearer ${token}` : null);

  // If unauthorized, try to refresh once
  if (response.status === 401 && retryCount < MAX_RETRIES) {
    console.log('♻️ Got 401, trying refresh (attempt', retryCount + 1, ')');
    const newToken = await refreshToken();
    if (newToken) {
      return apiRequest<T>(endpoint, options, retryCount + 1);
    }
    throw new Error('Session expired. Please sign in again.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ============================================================================
// User Profile API
// ============================================================================

// ... (imports)

export interface UserProfile {
  id: string;
  username: string; // Added username
  height_cm: number;
  age: number;
  gender: 'male' | 'female';
  goal_weight_lbs: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileRequest {
  username: string; // Added username
  height_cm: number;
  age: number;
  gender: 'male' | 'female';
  initial_weight_lbs: number;
  goal_weight_lbs: number;
}

export interface UpdateWeightRequest {
  weight_lbs: number;
}

export interface WeightEntry {
  weight_lbs: number;
  measured_at: string;
}

/**
 * Create user profile
 * POST /users/me
 */
export async function createProfile(data: CreateProfileRequest): Promise<UserProfile> {
  return apiRequest<UserProfile>('/users/me', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get current user profile
 * GET /users/me
 */
export async function getProfile(): Promise<UserProfile> {
  return apiRequest<UserProfile>('/users/me', {
    method: 'GET',
  });
}

/**
 * Update current weight
 * PUT /users/me/weight
 */
export async function updateWeight(data: UpdateWeightRequest): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/users/me/weight', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Get weight history
 * GET /users/me/weights
 */
export async function getWeightHistory(): Promise<WeightEntry[]> {
  return apiRequest<WeightEntry[]>('/users/me/weights', {
    method: 'GET',
  });
}

// ============================================================================
// Leaderboard API
// ============================================================================

export interface LeaderboardEntry {
  rank: number;
  username: string;
  lost_percent: number;
  initial_weight: number;
  current_weight: number;
  lost_weight: number;
  is_current_user: boolean;
}

/**
 * Get leaderboard
 * GET /leaderboard (public endpoint)
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return apiRequest<LeaderboardEntry[]>('/leaderboard', {
    method: 'GET',
  });
}
