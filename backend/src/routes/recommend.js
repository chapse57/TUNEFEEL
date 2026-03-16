// const express = require('express');
// const router = express.Router();
// const { getRecommendations } = require('../services/claude');
// const { searchYouTube } = require('../services/youtube');

// router.post('/recommend', async (req, res) => {
//   try {
//     const { mode, params } = req.body;

//     const result = await getRecommendations(mode, params);

//     const songs = await Promise.all(
//       result.songs.map(async (song) => {
//         const youtubeUrl = await searchYouTube(song.title, song.artist);
//         return {
//           ...song,
//           youtubeUrl: youtubeUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + song.artist)}`,
//           spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(song.title + ' ' + song.artist)}`,
//         };
//       })
//     );

//     res.json({ songs });
//   } catch (err) {
//     console.error('에러 상태:', err.response?.status);
//     console.error('에러 URL:', err.config?.url);
//     console.error('에러 내용:', JSON.stringify(err.response?.data));
//     res.status(500).json({ error: '추천을 가져오지 못했어요' });
//   }
// });

// module.exports = router;




const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../services/claude');

router.post('/recommend', async (req, res) => {
  try {
    const { mode, params } = req.body;
    const result = await getRecommendations(mode, params);

    const songs = result.songs.map((song) => ({
      ...song,
      youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + song.artist + ' official')}`,
      spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(song.title + ' ' + song.artist)}`,
    }));

    res.json({ songs });
  } catch (err) {
    console.error('에러 전체:', err.message);
    console.error('에러 상태:', err.response?.status);
    console.error('에러 URL:', err.config?.url);
    console.error('에러 내용:', JSON.stringify(err.response?.data));
    res.status(500).json({ error: '추천을 가져오지 못했어요' });
  }
});

module.exports = router;