import { useState } from 'react'
import axios from 'axios'

export function useRecommend() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const recommend = async (mode, params) => {
    setLoading(true)
    setError(null)
    setSongs([])

    try {
      const res = await axios.post('http://localhost:4000/api/recommend', {
        mode,
        params,
      })
      setSongs(res.data.songs)
    } catch (err) {
      setError('추천을 가져오지 못했어요. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return { songs, loading, error, recommend }
}