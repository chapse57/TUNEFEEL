const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

// 회원가입
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) return res.status(400).json({ error: error.message });

    // users 테이블에 추가
    await supabase.from('users').insert({
      id: data.user.id,
      email: data.user.email,
      plan: 'free',
    });

    res.json({ message: '회원가입 성공!' });
  } catch (err) {
    res.status(500).json({ error: '회원가입 실패' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(400).json({ error: error.message });

    res.json({
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
      }
    });
  } catch (err) {
    res.status(500).json({ error: '로그인 실패' });
  }
});

// 내 정보 가져오기
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: '토큰이 없어요' });

    const { data, error } = await supabase.auth.getUser(token);
    if (error) return res.status(401).json({ error: '인증 실패' });

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.json(userData);
  } catch (err) {
    res.status(500).json({ error: '정보 가져오기 실패' });
  }
});

module.exports = router;