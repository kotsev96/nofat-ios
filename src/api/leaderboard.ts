/**
 * API functions for leaderboard
 */

const API_BASE_URL = 'http://localhost:8028';

export interface LeaderboardEntry {
  rank: number;
  username: string;
  lost_percent: number;
  initial_weight: number; // lbs - начальный вес (30 дней назад)
  current_weight: number; // lbs - текущий вес
  lost_weight: number; // lbs - абсолютная потеря веса
  is_current_user: boolean; // является ли текущим пользователем
}

/**
 * Get leaderboard from backend
 * Returns top 25 users by weight loss percentage over last 30 days
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 500) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Internal server error');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LeaderboardEntry[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}


