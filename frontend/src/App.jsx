import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Home from './pages/Home'
import Login from './pages/Login'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 현재 로그인 상태 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 로그인 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) return null

  return (
    <div className="app">
      {user ? (
        <Home user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={setUser} />
      )}
    </div>
  )
}

export default App