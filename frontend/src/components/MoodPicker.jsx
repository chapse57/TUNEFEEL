import { useState } from 'react'

const MOODS = [
  '☀️ 기분 좋은', '🌙 감성적인', '🔥 에너지 넘치는',
  '💭 생각하고 싶은', '💔 위로받고 싶은', '🎉 신나는',
  '😌 잔잔하고 편안한', '😤 화나고 답답한', '🌧 비오는 날',
  '🚗 드라이브', '📚 집중할 때', '🌃 새벽 감성'
]

export default function MoodPicker({ onRecommend, loading }) {
  const [selected, setSelected] = useState([])
  const [detail, setDetail] = useState('')

  const toggleMood = (mood) => {
    setSelected(prev =>
      prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
    )
  }

  const handleSubmit = () => {
    if (selected.length === 0) return
    onRecommend('mood', { mood: selected.join(', '), detail, count: 10 })
  }

  return (
    <div className="input-section">
      <div className="field">
        <label>지금 기분/분위기</label>
        <div className="mood-grid">
          {MOODS.map(mood => (
            <button
              key={mood}
              className={`mood-chip ${selected.includes(mood) ? 'selected' : ''}`}
              onClick={() => toggleMood(mood)}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>
      <div className="field">
        <label>더 구체적으로 (선택)</label>
        <textarea
          placeholder="예: 퇴근하고 혼자 듣고 싶은, 가사가 깊었으면 좋겠어..."
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          rows={3}
        />
      </div>
      <button className="btn-submit" onClick={handleSubmit} disabled={loading || selected.length === 0}>
        {loading ? '추천 중...' : '🎵 추천받기'}
      </button>
    </div>
  )
}