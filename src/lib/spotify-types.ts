export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  country: string;
  followers: {
    total: number;
  };
  images: Array<{
    url: string;
    height: number | null;
    width: number | null;
  }>;
  external_urls: {
    spotify: string;
  };
  type: 'user';
  uri: string;
  product?: string;
}

export interface Artist {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
  uri: string;
  type: 'artist';
}

export interface Album {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number | null;
    width: number | null;
  }>;
  external_urls: {
    spotify: string;
  };
  release_date: string;
  type: 'album';
  uri: string;
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  uri: string;
  type: 'track';
  explicit: boolean;
  popularity?: number;
}

export interface RecentlyPlayedItem {
  track: Track;
  played_at: string;
  context: {
    type: string;
    href: string;
    external_urls: {
      spotify: string;
    };
    uri: string;
  } | null;
}

export interface RecentlyPlayedResponse {
  items: RecentlyPlayedItem[];
  next: string | null;
  cursors: {
    after: string;
    before: string;
  };
  limit: number;
  href: string;
}

export interface TrackPlay {
  id: string;
  trackName: string;
  artistNames: string[];
  albumName: string;
  albumImageUrl: string | null;
  playedAt: Date;
  durationMs: number;
  spotifyUrl: string;
}
