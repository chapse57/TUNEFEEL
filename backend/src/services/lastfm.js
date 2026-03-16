const axios = require('axios');

const API_KEY = process.env.LASTFM_API_KEY;
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

// 아티스트와 유사한 아티스트 가져오기
async function getSimilarArtists(artist) {
  const response = await axios.get(BASE_URL, {
    params: {
      method: 'artist.getSimilar',
      artist,
      api_key: API_KEY,
      format: 'json',
      limit: 10,
    }
  });
  return response.data.similarartists?.artist?.map(a => a.name) || [];
}

// 아티스트의 인기곡 가져오기
async function getTopTracks(artist) {
  const response = await axios.get(BASE_URL, {
    params: {
      method: 'artist.getTopTracks',
      artist,
      api_key: API_KEY,
      format: 'json',
      limit: 5,
    }
  });
  return response.data.toptracks?.track?.map(t => ({
    title: t.name,
    artist: t.artist?.name || artist,
  })) || [];
}

// 아티스트 기반으로 추천 곡 풀 만들기
async function getRecommendationPool(artist) {
  try {
    const similarArtists = await getSimilarArtists(artist);
    
    const trackPromises = similarArtists.slice(0, 6).map(a => getTopTracks(a));
    const trackResults = await Promise.all(trackPromises);
    
    const allTracks = trackResults.flat();
    return allTracks;
  } catch (err) {
    console.error('Last.fm 에러:', err.message);
    return [];
  }
}

module.exports = { getRecommendationPool, getSimilarArtists };