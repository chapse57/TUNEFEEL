const axios = require('axios');

function isMusicVideo(title) {
  const mvKeywords = ['mv', 'm/v', 'music video', '뮤직비디오', 'official mv', 'official m/v', 'remix', 'remixed', 'ver.', 'version', 'live', 'cover', 'inst', 'instrumental'];
  const t = title.toLowerCase();
  return mvKeywords.some(keyword => t.includes(keyword));
}

// 영상 제목이 곡 제목을 포함하는지 체크 (교집합 방식)
function titleMatches(videoTitle, songTitle) {
  const vt = videoTitle.toLowerCase();
  const st = songTitle.toLowerCase();
  
  // 곡 제목을 단어로 분리
  const words = st.split(/[\s\(\)]+/).filter(w => w.length > 1);
  
  // 모든 단어가 영상 제목에 포함되면 매칭
  return words.every(word => vt.includes(word));
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

  // Topic 채널이면서 MV 아니고 제목 매칭
  const topicVideo = items.find(item =>
    item.snippet.channelTitle.toLowerCase().includes('topic') &&
    !isMusicVideo(item.snippet.title) &&
    titleMatches(item.snippet.title, title)
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

  // Topic 채널이면서 MV 아니고 제목 매칭
  const topicVideo = items.find(item =>
    item.snippet.channelTitle.toLowerCase().includes('topic') &&
    !isMusicVideo(item.snippet.title) &&
    titleMatches(item.snippet.title, title)
  );
  if (topicVideo) return `https://www.youtube.com/watch?v=${topicVideo.id.videoId}`;

  // auto-generated이면서 MV 아니고 제목 매칭
  const autoVideo = items.find(item =>
    !isMusicVideo(item.snippet.title) &&
    titleMatches(item.snippet.title, title) && (
      item.snippet.description?.toLowerCase().includes('auto-generated') ||
      item.snippet.description?.toLowerCase().includes('provided to youtube')
    )
  );
  if (autoVideo) return `https://www.youtube.com/watch?v=${autoVideo.id.videoId}`;

  // MV 아니고 제목+아티스트 매칭
  const exactMatch = items.find(item =>
    !isMusicVideo(item.snippet.title) &&
    titleMatches(item.snippet.title, title)
  );
  if (exactMatch) return `https://www.youtube.com/watch?v=${exactMatch.id.videoId}`;

  // 그래도 없으면 첫 번째
  return `https://www.youtube.com/watch?v=${items[0].id.videoId}`;
}

module.exports = { searchYouTube };