require('dotenv').config();

// 환경변수 확인용 로그 추가
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '있음' : '없음');

const express = require('express');
const cors = require('cors');
const rateLimit = require('./middleware/rateLimit');

const recommendRoute = require('./routes/recommend');
const authRoute = require('./routes/auth');
const paymentsRoute = require('./routes/payments');

const app = express();

app.use(cors({
  origin: 'https://tunefeel.vercel.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cors());
app.use(express.json());

app.use('/api/recommend', rateLimit);
app.use('/api', recommendRoute);
app.use('/api/auth', authRoute);
app.use('/api/payments', paymentsRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});