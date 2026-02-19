require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const { HttpsProxyAgent } = require('https-proxy-agent');

const proxy = new HttpsProxyAgent('http://127.0.0.1:7890');

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
}, { httpAgent: proxy });

async function test() {
  console.log('🔍 测试 v1.1 API...');
  try {
    const result = await client.v1.tweet('测试 v1.1 🔧');
    console.log('✅ 成功!');
    console.log('ID:', result.id_str);
  } catch (e) {
    console.log('❌ 失败:', e.message);
    if (e.data) console.log('Data:', JSON.stringify(e.data));
  }
}

test();
