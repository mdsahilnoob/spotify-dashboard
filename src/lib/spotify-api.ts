import { getAccessToken, logout } from './spotify-auth';
import type { 
  SpotifyUser, 
  RecentlyPlayedResponse, 
  RecentlyPlayedItem,
  TrackPlay 
} from './spotify-types';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  country: string;
  followers: number;
  imageUrl: string | null;
  spotifyUrl: string;
  type: string;
}

export interface Track {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
  durationMs: number;
  previewUrl: string | null;
  spotifyUrl: string;
}

export interface RecentlyPlayedTrack {
  track: Track;
  playedAt: string;
}

export class SpotifyApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'SpotifyApiError';
  }
}

async function makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();

  if (!token) {
    throw new SpotifyApiError('No access token available. Please login first.', 401);
  }

  try {
    const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 401) {
      logout();
      throw new SpotifyApiError('Authentication expired. Please login again.', 401);
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new SpotifyApiError(
        errorData.error?.message || `API request failed with status ${response.status}`,
        response.status,
        errorData
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof SpotifyApiError) {
      throw error;
    }
    throw new SpotifyApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      0
    );
  }
}

export async function getUserProfile(): Promise<UserProfile> {
  const response = await makeRequest<SpotifyUser>('/me');
  return {
    id: response.id,
    displayName: response.display_name || 'Unknown User',
    email: response.email || '',
    country: response.country || 'Unknown',
    followers: response.followers?.total || 0,
    imageUrl: response.images?.[0]?.url || null,
    spotifyUrl: response.external_urls?.spotify || '',
    type: response.type || 'user',
  };
}

export async function getRecentlyPlayedTracks(limit: number = 20): Promise<RecentlyPlayedTrack[]> {
  const validLimit = Math.max(1, Math.min(50, limit));

  const response = await makeRequest<RecentlyPlayedResponse>(
    `/me/player/recently-played?limit=${validLimit}`
  );
  return response.items.map((item: RecentlyPlayedItem) => ({
    track: normalizeTrack(item.track),
    playedAt: item.played_at,
  }));
}

export async function getTrackPlayHistory(limit: number = 20): Promise<TrackPlay[]> {
  const validLimit = Math.max(1, Math.min(50, limit));

  const response = await makeRequest<RecentlyPlayedResponse>(
    `/me/player/recently-played?limit=${validLimit}`
  );
  return response.items.map((item: RecentlyPlayedItem): TrackPlay => ({
    id: item.track.id,
    trackName: item.track.name,
    artistNames: item.track.artists.map(a => a.name),
    albumName: item.track.album.name,
    albumImageUrl: item.track.album.images?.[0]?.url || null,
    playedAt: new Date(item.played_at),
    durationMs: item.track.duration_ms,
    spotifyUrl: item.track.external_urls.spotify,
  }));
}

function normalizeTrack(rawTrack: any): Track {
  return {
    id: rawTrack.id,
    name: rawTrack.name,
    artists: rawTrack.artists.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
    })),
    album: {
      id: rawTrack.album.id,
      name: rawTrack.album.name,
      imageUrl: rawTrack.album.images?.[0]?.url || null,
    },
    durationMs: rawTrack.duration_ms,
    previewUrl: rawTrack.preview_url || null,
    spotifyUrl: rawTrack.external_urls?.spotify || '',
  };
}
