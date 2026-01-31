const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';
const REDIRECT_URI = 'http://localhost:5173/callback';
const SCOPES = ['user-read-private', 'user-read-recently-played'];
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

const ACCESS_TOKEN_KEY = 'spotify_access_token';
const TOKEN_EXPIRY_KEY = 'spotify_token_expiry';
const CODE_VERIFIER_KEY = 'spotify_code_verifier';

function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

async function sha256(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64urlEncode(hash);
}

function base64urlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const binary = String.fromCharCode(...bytes);
  const base64 = btoa(binary);
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function loginWithSpotify(): Promise<void> {
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await sha256(codeVerifier);

  sessionStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    scope: SCOPES.join(' '),
  });

  window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`;
}

export async function handleSpotifyCallback(): Promise<string | null> {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const error = params.get('error');

  if (error) {
    console.error('Spotify authorization error:', error);
    return null;
  }

  if (!code) {
    console.error('No authorization code found in callback URL');
    return null;
  }

  const codeVerifier = sessionStorage.getItem(CODE_VERIFIER_KEY);
  if (!codeVerifier) {
    console.error('Code verifier not found in session storage');
    return null;
  }

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Token exchange failed:', errorData);
      return null;
    }

    const data = await response.json();

    const expiresIn = data.expires_in;
    const expiryTime = Date.now() + expiresIn * 1000;

    sessionStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
    sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

    sessionStorage.removeItem(CODE_VERIFIER_KEY);

    return data.access_token;
  } catch (error) {
    console.error('Error during token exchange:', error);
    return null;
  }
}

export function getAccessToken(): string | null {
  const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
  const expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);

  if (!token || !expiry) {
    return null;
  }

  const expiryTime = parseInt(expiry, 10);
  if (Date.now() >= expiryTime) {
    logout();
    return null;
  }

  return token;
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

export function logout(): void {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
  sessionStorage.removeItem(CODE_VERIFIER_KEY);
}

export async function spotifyApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available. Please login first.');
  }

  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      logout();
      throw new Error('Authentication expired. Please login again.');
    }
    throw new Error(`Spotify API error: ${response.status}`);
  }

  return response.json();
}
