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

async function tweet(text) {
  try {
    const result = await client.v2.tweet(text);
    console.log('✅ 发推成功!');
    console.log('🔗 ID:', result.data.id);
    return result;
  } catch (e) {
    console.error('❌ 发推失败:', e.message);
    if (e.data) console.error('Data:', JSON.stringify(e.data));
    throw e;
  }
}

module.exports = { tweet, client };
