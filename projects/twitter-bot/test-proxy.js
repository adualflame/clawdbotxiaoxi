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
  console.log('🔍 测试中 (via Clash)...');
  
  try {
    const me = await client.v2.me();
    console.log('✅ 成功!');
    console.log('用户:', me.data.username);
  } catch (e) {
    console.log('❌ 失败');
    console.log('Code:', e.code);
    console.log('Msg:', e.message);
    if (e.data) console.log('Data:', JSON.stringify(e.data));
  }
}

test();
