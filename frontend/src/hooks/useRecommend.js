import { useState } from 'react'
import axios from 'axios'
import { supabase } from '../lib/supabase'

export function useRecommend() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const recommend = async (mode, params) => {
    setLoading(true)
    setError(null)
    setSongs([])

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/recommend`,
        { mode, params },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSongs(res.data.songs)
    } catch (err) {
      if (err.response?.status === 429) {
        setError('오늘 무료 추천 횟수(3회)를 모두 사용했어요. 프리미엄으로 업그레이드하세요!')
      } else {
        setError('추천을 가져오지 못했어요. 다시 시도해주세요.')
      }
    } finally {
      setLoading(false)
    }
  }

  return { songs, loading, error, recommend }
}