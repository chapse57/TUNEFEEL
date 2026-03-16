const axios = require('axios');

async function getRecommendations(mode, params) {
  let prompt = '';

  if (mode === 'artist') {
    prompt = `너는 음악 추천 전문가야. 다음 조건으로 노래 ${params.count || 10}곡을 추천해줘.

좋아하는 아티스트/곡: ${params.artist}
${params.style ? '원하는 스타일: ' + params.style : ''}
${params.genres ? '선호 장르: ' + params.genres : ''}
${params.lang ? '언어: ' + params.lang : ''}

조건:
- 비슷한 감성이나 스타일의 곡
- 가사에 내용이 있고 깊이 있는 곡 위주
- 다양한 아티스트로 골고루

반드시 JSON만 응답해. 다른 텍스트 없이:
{"songs":[{"title":"곡제목","artist":"아티스트명","reason":"추천 이유 1문장"}]}`;
  } else {
    prompt = `너는 음악 추천 전문가야. 다음 기분에 맞는 노래 ${params.count || 10}곡 추천해줘.

기분/분위기: ${params.mood}
${params.detail ? '추가 설명: ' + params.detail : ''}
${params.lang ? '언어: ' + params.lang : ''}

반드시 JSON만 응답해. 다른 텍스트 없이:
{"songs":[{"title":"곡제목","artist":"아티스트명","reason":"추천 이유 1문장"}]}`;
  }

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  const text = response.data.choices[0].message.content;
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

module.exports = { getRecommendations };