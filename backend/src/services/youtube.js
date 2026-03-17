const axios = require('axios');

async function searchWithQuery(query, title, artist) {
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

  // Topic 채널 우선
  const topicVideo = items.find(item =>
    item.snippet.channelTitle.toLowerCase().includes('topic')
  );
  if (topicVideo) return `https://www.youtube.com/watch?v=${topicVideo.id.videoId}`;

  return null;
}

async function searchYouTube(title, artist) {
  // 1차: topic 키워드로 직접 검색
  const topicResult = await searchWithQuery(`${artist} ${title} topic`, title, artist);
  if (topicResult) return topicResult;

  // 2차: 일반 검색에서 topic 채널 또는 auto-generated 찾기
  const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      key: process.env.YOUTUBE_API_KEY,
      q: `${artist} ${title}`,
      part: 'snippet',
      type: 'video',
      maxResults: 10,
      videoCategoryId: '10',
      order: 'relevance'
    }
  });

  const items = response.data.items;
  if (!items || items.length === 0) return null;

  const topicVideo = items.find(item =>
    item.snippet.channelTitle.toLowerCase().includes('topic')
  );
  if (topicVideo) return `https://www.youtube.com/watch?v=${topicVideo.id.videoId}`;

  const autoVideo = items.find(item =>
    item.snippet.description?.toLowerCase().includes('auto-generated') ||
    item.snippet.description?.toLowerCase().includes('provided to youtube')
  );
  if (autoVideo) return `https://www.youtube.com/watch?v=${autoVideo.id.videoId}`;

  const exactMatch = items.find(item => {
    const t = item.snippet.title.toLowerCase();
    return t.includes(title.toLowerCase()) && t.includes(artist.toLowerCase());
  });
  if (exactMatch) return `https://www.youtube.com/watch?v=${exactMatch.id.videoId}`;

  const titleMatch = items.find(item =>
    item.snippet.title.toLowerCase().includes(title.toLowerCase())
  );
  if (titleMatch) return `https://www.youtube.com/watch?v=${titleMatch.id.videoId}`;

  return `https://www.youtube.com/watch?v=${items[0].id.videoId}`;
}

module.exports = { searchYouTube };