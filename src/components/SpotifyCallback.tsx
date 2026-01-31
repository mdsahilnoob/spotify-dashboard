import { useEffect, useState } from 'react';
import { handleSpotifyCallback } from '../lib/spotify-auth';

export function SpotifyCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const token = await handleSpotifyCallback();
        
        if (token) {
          setStatus('success');
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          setStatus('error');
          setErrorMessage('Failed to authenticate. Please try again.');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
      }
    };

    processCallback();
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
    }}>
      {status === 'loading' && (
        <div>
          <h2>Authenticating with Spotify...</h2>
          <p>Please wait while we complete your login.</p>
        </div>
      )}

      {status === 'success' && (
        <div>
          <h2>✓ Successfully authenticated!</h2>
          <p>Redirecting to dashboard...</p>
        </div>
      )}

      {status === 'error' && (
        <div>
          <h2>Authentication failed</h2>
          <p>{errorMessage}</p>
          <button onClick={() => window.location.href = '/'}>
            Return to home
          </button>
        </div>
      )}
    </div>
  );
}
