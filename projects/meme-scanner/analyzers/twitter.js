const axios = require('axios');

class TwitterAnalyzer {
  constructor() {
    this.cache = new Map();
  }

  async searchMentions(tokenName, symbol) {
    try {
      // 使用 Nitter 实例搜索（免费）
      const query = encodeURIComponent(`${symbol} OR ${tokenName}`);
      const url = `https://nitter.net/search?f=tweets&q=${query}`;
      
      const res = await axios.get(url, {
        timeout: 10000,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      
      // 简单统计提及次数
      const mentions = (res.data.match(/tweet-content/g) || []).length;
      return { mentions, url };
    } catch (e) {
      return { mentions: 0, url: null };
    }
  }
}

module.exports = TwitterAnalyzer;
