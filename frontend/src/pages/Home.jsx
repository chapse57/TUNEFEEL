import { useState } from 'react'
import ArtistInput from '../components/ArtistInput'
import MoodPicker from '../components/MoodPicker'
import SongCard from '../components/SongCard'
import { useRecommend } from '../hooks/useRecommend'
import { supabase } from '../lib/supabase'
import axios from 'axios'

export default function Home({ user, plan, onLogout }) {
  const [mode, setMode] = useState('artist')
  const { songs, loading, error, recommend, remaining } = useRecommend()
  
  const handleUpgrade = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payments/checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      window.location.href = res.data.url
    } catch (err) {
      alert('결제 페이지 연결 실패. 다시 시도해주세요.')
    }
  }

  return (
    <div className="container">
      <header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="logo">TUNEFEEL</h1>
            <p className="tagline">AI가 찾아주는 나만의 플레이리스트</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.75rem', color: '#777', marginBottom: '6px' }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              {plan === 'premium' ? (
                <span style={{
                  background: 'transparent',
                  border: '1px solid #c8f135',
                  color: '#c8f135',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}>
                  ⭐ 프리미엄
                </span>
              ) : (
                <button
                  onClick={handleUpgrade}
                  style={{
                    background: '#c8f135',
                    border: 'none',
                    color: '#000',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}
                >
                  ⭐ 프리미엄
                </button>
              )}
              <button
                onClick={onLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#777',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mode-toggle">
        <button
          className={`mode-btn ${mode === 'artist' ? 'active' : ''}`}
          onClick={() => setMode('artist')}
        >
          🎤 아티스트 기반
        </button>
        <button
          className={`mode-btn ${mode === 'mood' ? 'active' : ''}`}
          onClick={() => setMode('mood')}
        >
          🌙 기분 기반
        </button>
      </div>

      {mode === 'artist' ? (
        <ArtistInput onRecommend={recommend} loading={loading} />
      ) : (
        <MoodPicker onRecommend={recommend} loading={loading} />
      )}

      {/* 무료 플랜 안내 */}
      {true && (
        <p style={{
          textAlign: 'center',
          color: '#777',
          fontSize: '0.8rem',
          marginTop: '8px'
        }}>
          이용횟수: ({3 - remaining}/{3})
          <span
            onClick={handleUpgrade}
            style={{ color: '#c8f135', cursor: 'pointer', marginLeft: '8px' }}
          >
            프리미엄 업그레이드 →
          </span>
        </p>
      )}

      {error && <div className="error-box">{error}</div>}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>AI가 플레이리스트를 만들고 있어요...</p>
        </div>
      )}

      {songs.length > 0 && (
        <div className="results">
          <div className="results-header">
            <h2>추천 플레이리스트</h2>
            <span>{songs.length}곡</span>
          </div>
          {songs.map((song, i) => (
            <SongCard key={i} song={song} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}