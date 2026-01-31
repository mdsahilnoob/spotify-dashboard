import { useEffect, useState } from 'react';
import { loginWithSpotify, logout, isAuthenticated } from '../lib/spotify-auth';
import { getUserProfile, getRecentlyPlayedTracks, UserProfile, RecentlyPlayedTrack } from '../lib/spotify-api';

export function SpotifyAuthExample() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recentTracks, setRecentTracks] = useState<RecentlyPlayedTrack[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchUserData();
    }
  }, [authenticated]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [profile, tracks] = await Promise.all([
        getUserProfile(),
        getRecentlyPlayedTracks(10),
      ]);
      setUserProfile(profile);
      setRecentTracks(tracks);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      if (error instanceof Error && error.message.includes('expired')) {
        setAuthenticated(false);
        setUserProfile(null);
        setRecentTracks([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    loginWithSpotify();
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUserProfile(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Spotify Dashboard</h1>

      {!authenticated ? (
        <div>
          <p>Connect your Spotify account to get started</p>
          <button 
            onClick={handleLogin}
            style={{
              padding: '12px 24px',
              backgroundColor: '#1DB954',
              color: 'white',
              border: 'none',
              borderRadius: '24px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Login with Spotify
          </button>
        </div>
      ) : (
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <h2>Welcome, {userProfile?.displayName || 'User'}!</h2>
              
              {userProfile && (
                <div style={{ marginTop: '20px', marginBottom: '30px' }}>
                  {userProfile.imageUrl && (
                    <img 
                      src={userProfile.imageUrl} 
                      alt="Profile" 
                      style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '10px' }}
                    />
                  )}
                  <p><strong>Email:</strong> {userProfile.email}</p>
                  <p><strong>Country:</strong> {userProfile.country}</p>
                  <p><strong>Followers:</strong> {userProfile.followers}</p>
                </div>
              )}

              {recentTracks.length > 0 && (
                <div style={{ marginTop: '30px' }}>
                  <h3>Recently Played</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {recentTracks.map((item, index) => (
                      <div 
                        key={`${item.track.id}-${index}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '15px',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                        }}
                      >
                        {item.track.album.imageUrl && (
                          <img 
                            src={item.track.album.imageUrl} 
                            alt={item.track.album.name}
                            style={{ width: '60px', height: '60px', borderRadius: '4px' }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold' }}>{item.track.name}</div>
                          <div style={{ color: '#666', fontSize: '14px' }}>
                            {item.track.artists.map(a => a.name).join(', ')}
                          </div>
                          <div style={{ color: '#999', fontSize: '12px' }}>
                            {item.track.album.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={handleLogout}
                style={{
                  marginTop: '30px',
                  padding: '10px 20px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
