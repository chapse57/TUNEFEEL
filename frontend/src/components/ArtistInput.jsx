import { useState } from 'react'

export default function ArtistInput({ onRecommend, loading }) {
  const [artist, setArtist] = useState('')
  const [style, setStyle] = useState('')

  const handleSubmit = () => {
    if (!artist.trim()) return
    onRecommend('artist', { artist, style, count: 10 })
  }

  return (
    <div className="input-section">
      <div className="field">
        <label>좋아하는 아티스트나 곡</label>
        <input
          type="text"
          placeholder="예: 한로로, 에픽하이, Frank Ocean..."
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </div>
      <div className="field">
        <label>원하는 스타일 (선택)</label>
        <input
          type="text"
          placeholder="예: 가사가 깊은, 기분 좋은, 잔잔한..."
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </div>
      <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
        {loading ? '추천 중...' : '🎵 추천받기'}
      </button>
    </div>
  )
}