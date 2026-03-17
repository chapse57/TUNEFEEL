const axios = require('axios');

async function searchYouTube(title, artist) {
  // 따옴표 제거하고 자연스러운 쿼리로
  const query = `${artist} ${title} official`
  
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

  const best = items.find(item => {
    const channelTitle = item.snippet.channelTitle.toLowerCase();
    return channelTitle.includes('topic')
  }) || items.find(item => {
    const videoTitle = item.snippet.title.toLowerCase();
    return videoTitle.includes(title.toLowerCase()) && 
           videoTitle.includes(artist.toLowerCase())
  }) || items[0];

  return `https://www.youtube.com/watch?v=${best.id.videoId}`;
}

module.exports = { searchYouTube };