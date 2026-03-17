const axios = require('axios');

// MV/뮤직비디오 영상인지 체크
function isMusicVideo(title) {
  const mvKeywords = ['mv', 'm/v', 'music video', '뮤직비디오', 'official mv', 'official m/v'];
  const t = title.toLowerCase();
  return mvKeywords.some(keyword => t.includes(keyword));
}

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

  // Topic 채널이면서 MV 아닌 것
  const topicVideo = items.find(item =>
    item.snippet.channelTitle.toLowerCase().includes('topic') &&
    !isMusicVideo(item.snippet.title)
  );
  if (topicVideo) return `https://www.youtube.com/watch?v=${topicVideo.id.videoId}`;

  return null;
}

async function searchYouTube(title, artist) {
  // 1차: topic 키워드로 직접 검색
  const topicResult = await searchWithQuery(`${artist} ${title} topic`, title, artist);
  if (topicResult) return topicResult;

  // 2차: 일반 검색
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

  // Topic 채널이면서 MV 아닌 것
  const topicVideo = items.find(item =>
    item.snippet.channelTitle.toLowerCase().includes('topic') &&
    !isMusicVideo(item.snippet.title)
  );
  if (topicVideo) return `https://www.youtube.com/watch?v=${topicVideo.id.videoId}`;

  // auto-generated이면서 MV 아닌 것
  const autoVideo = items.find(item =>
    !isMusicVideo(item.snippet.title) && (
      item.snippet.description?.toLowerCase().includes('auto-generated') ||
      item.snippet.description?.toLowerCase().includes('provided to youtube')
    )
  );
  if (autoVideo) return `https://www.youtube.com/watch?v=${autoVideo.id.videoId}`;

  // MV 아닌 것 중에서 제목+아티스트 포함
  const exactMatch = items.find(item => {
    const t = item.snippet.title.toLowerCase();
    return !isMusicVideo(item.snippet.title) &&
           t.includes(title.toLowerCase()) &&
           t.includes(artist.toLowerCase());
  });
  if (exactMatch) return `https://www.youtube.com/watch?v=${exactMatch.id.videoId}`;

  // MV 아닌 것 중 제목만 포함
  const titleMatch = items.find(item =>
    !isMusicVideo(item.snippet.title) &&
    item.snippet.title.toLowerCase().includes(title.toLowerCase())
  );
  if (titleMatch) return `https://www.youtube.com/watch?v=${titleMatch.id.videoId}`;

  // 그래도 없으면 첫 번째
  return `https://www.youtube.com/watch?v=${items[0].id.videoId}`;
}

module.exports = { searchYouTube };