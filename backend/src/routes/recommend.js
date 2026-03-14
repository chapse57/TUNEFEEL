const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../services/claude');
const { searchTrack } = require('../services/spotify');

router.post('/recommend', async (req, res) => {
  try {
    const { mode, params } = req.body;

    const result = await getRecommendations(mode, params);

    const songs = await Promise.all(
      result.songs.map(async (song) => {
        const spotifyData = await searchTrack(song.title, song.artist);
        return {
          ...song,
          albumArt: spotifyData?.albumArt || null,
          previewUrl: spotifyData?.previewUrl || null,
          spotifyUrl: spotifyData?.spotifyUrl || null,
          youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + song.artist)}`,
        };
      })
    );

    res.json({ songs });
  } catch (err) {
    console.error('에러 상태:', err.response?.status);
    console.error('에러 내용:', JSON.stringify(err.response?.data));
    res.status(500).json({ error: '추천을 가져오지 못했어요' });
  }
});

module.exports = router;