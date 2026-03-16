const requestCounts = {}

function rateLimit(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const today = new Date().toISOString().split('T')[0]
  const key = `${ip}_${today}`

  if (!requestCounts[key]) {
    requestCounts[key] = 0
  }

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