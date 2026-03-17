require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('./middleware/rateLimit');

const recommendRoute = require('./routes/recommend');
const authRoute = require('./routes/auth');
const paymentsRoute = require('./routes/payments');

const app = express();
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