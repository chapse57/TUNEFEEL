require('dotenv').config();
const express = require('express');
const cors = require('cors');

const recommendRoute = require('./routes/recommend');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', recommendRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});