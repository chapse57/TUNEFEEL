const axios = require('axios');

async function searchYouTube(title, artist) {
  const query = `${artist} ${title}`  // official 제거!
  
  const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      key: process.env.YOUTUBE_API_KEY,
      q: query,
      part: 'snippet',
      type: 'video',
      maxResults: 10,
      videoCategoryId: '10',
      order: 'relevance'
    }
  });

  const items = response.data.items;
  if (!items || items.length === 0) return null;

  // 1순위: Topic 채널
  const topicVideo = items.find(item =>
    item.snippet.channelTitle.toLowerCase().includes('topic')
  );
  if (topicVideo) return `https://www.youtube.com/watch?v=${topicVideo.id.videoId}`;

  // 2순위: 제목+아티스트 둘 다 포함
  const exactMatch = items.find(item => {
    const t = item.snippet.title.toLowerCase();
    return t.includes(title.toLowerCase()) && t.includes(artist.toLowerCase());
  });
  if (exactMatch) return `https://www.youtube.com/watch?v=${exactMatch.id.videoId}`;

  // 3순위: 제목만 포함
  const titleMatch = items.find(item =>
    item.snippet.title.toLowerCase().includes(title.toLowerCase())
  );
  if (titleMatch) return `https://www.youtube.com/watch?v=${titleMatch.id.videoId}`;

  return `https://www.youtube.com/watch?v=${items[0].id.videoId}`;
}

module.exports = { searchYouTube };