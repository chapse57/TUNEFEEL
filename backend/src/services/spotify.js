const axios = require('axios');

let accessToken = null;
let tokenExpiry = null;

// Spotify 토큰 발급 (Client Credentials Flow)
async function getAccessToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
    }
  );

  accessToken = response.data.access_token;
  tokenExpiry = Date.now() + response.data.expires_in * 1000 - 60000;
  return accessToken;
}

// 곡 검색 (제목 + 아티스트)
async function searchTrack(title, artist) {
  const token = await getAccessToken();
  const query = encodeURIComponent(`track:${title} artist:${artist}`);

  const response = await axios.get(
    `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const track = response.data.tracks.items[0];
  if (!track) return null;

  return {
    title: track.name,
    artist: track.artists[0].name,
    albumArt: track.album.images[0]?.url,
    previewUrl: track.preview_url,
    spotifyUrl: track.external_urls.spotify,
  };
}

module.exports = { searchTrack };