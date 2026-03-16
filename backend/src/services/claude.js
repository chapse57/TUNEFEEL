const axios = require('axios');
const { getRecommendationPool } = require('./lastfm');

async function getRecommendations(mode, params) {
  let prompt = '';

  if (mode === 'artist') {
    // Last.fm에서 실제 존재하는 곡 풀 가져오기
    const pool = await getRecommendationPool(params.artist);
    
    const poolText = pool.length > 0
      ? `\n아래는 실제 존재하는 후보 곡들이야. 이 중에서 선택하거나 이와 비슷한 실제 곡을 추천해:\n${pool.map(t => `- ${t.artist} - ${t.title}`).join('\n')}`
      : '';

    prompt = `너는 세계 최고의 음악 큐레이터야. 다음 조건으로 노래 ${params.count || 10}곡을 추천해줘.

좋아하는 아티스트/곡: ${params.artist}
${params.style ? '원하는 스타일: ' + params.style : ''}
${poolText}

추천 원칙:
- 입력한 아티스트 본인 곡은 절대 추천하지 마
- 반드시 실제로 존재하는 곡만 추천해
- 가사에 문학적 깊이와 진정성이 있는 곡 위주
- 10곡 모두 서로 다른 아티스트
- 한국 아티스트 입력시 한국 곡 위주

반드시 JSON만 응답해. 다른 텍스트 없이:
{"songs":[{"title":"곡제목","artist":"아티스트명","reason":"이 곡을 추천하는 이유 2문장"}]}`;

  } else {
    prompt = `너는 세계 최고의 음악 큐레이터야. 다음 기분과 분위기에 완벽하게 맞는 노래 ${params.count || 10}곡을 추천해줘.

기분/분위기: ${params.mood}
${params.detail ? '추가 설명: ' + params.detail : ''}

추천 원칙:
- 입력한 아티스트 본인 곡은 절대 추천하지 마
- 입력한 아티스트와 감성, 가사 깊이, 장르가 비슷한 곡만 추천
- 가사에 문학적 깊이와 진정성이 있는 곡 위주
- 너무 유명한 메인스트림보다 진짜 좋은 곡 위주
- 10곡 모두 서로 다른 아티스트
- 한국 아티스트 입력시 한국 곡 위주, 외국 아티스트 입력시 외국 곡 위주


반드시 JSON만 응답해. 다른 텍스트 없이:
{"songs":[{"title":"곡제목","artist":"아티스트명","reason":"이 곡을 추천하는 이유 2문장"}]}`;
  }

  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
    }
  );

  const text = response.data.content[0].text;
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

module.exports = { getRecommendations };