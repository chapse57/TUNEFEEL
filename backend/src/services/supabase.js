const { createClient } = require('@supabase/supabase-js');

// 함수로 감싸서 나중에 실행되게
const getSupabase = () => {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
};

module.exports = getSupabase();