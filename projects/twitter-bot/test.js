require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

async function test() {
  console.log('🔍 测试 Twitter API 连接...\n');
  
  try {
    const me = await client.v2.me();
    console.log('✅ 连接成功!');
    console.log('👤 用户名:', me.data.username);
    console.log('📛 名称:', me.data.name);
  } catch (error) {
    console.error('❌ 连接失败:', error.message);
  }
}

test();
