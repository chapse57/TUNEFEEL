const requestCounts = {}
const supabase = require('../services/supabase')

async function rateLimit(req, res, next) {
  // 토큰 확인
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  // 토큰 있으면 프리미엄 체크
  if (token) {
    try {
      const { data, error } = await supabase.auth.getUser(token)
      console.log('auth.getUser 결과:', JSON.stringify(data))
      console.log('auth.getUser 에러:', JSON.stringify(error))
      if (data?.user) {
        const { data: userData, error: dbError } = await supabase
          .from('users')
          .select('plan')
          .eq('id', data.user.id)
          .single()
        console.log('users 조회 결과:', JSON.stringify(userData))
        console.log('users 조회 에러:', JSON.stringify(dbError))
        if (userData?.plan === 'premium') {
          res.setHeader('X-RateLimit-Remaining', 'unlimited')
          return next()
        }
      }
    } catch (e) {
      console.log('rateLimit 예외:', e.message)
    }
  }

  // 무료 유저는 IP 기반 3회 제한
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const today = new Date().toISOString().split('T')[0]
  const key = `${ip}_${today}`

  if (!requestCounts[key]) requestCounts[key] = 0
  requestCounts[key]++

  if (requestCounts[key] > 3) {
    return res.status(429).json({
      error: '오늘 무료 추천 횟수(3회)를 모두 사용했어요.',
      remaining: 0
    })
  }

  res.setHeader('X-RateLimit-Remaining', 3 - requestCounts[key])
  next()
}

module.exports = rateLimit