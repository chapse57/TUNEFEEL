const axios = require('axios');

async function searchYouTube(title, artist) {
  const query = `"${title}" "${artist}"`
  
  const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      key: process.env.YOUTUBE_API_KEY,
      q: query,
      part: 'snippet',
      type: 'video',
      maxResults: 5,
      videoCategoryId: '10',
      order: 'relevance'
    }
  });

  const items = response.data.items;
  if (!items || items.length === 0) return null;

  // 제목에 곡명 포함된 영상 우선
  const best = items.find(item => {
    const videoTitle = item.snippet.title.toLowerCase();
    return videoTitle.includes(title.toLowerCase())
  }) || items[0];

  return `https://www.youtube.com/watch?v=${best.id.videoId}`;
}

module.exports = { searchYouTube };