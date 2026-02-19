const axios = require('axios');

class DexScreener {
  constructor() {
    this.baseUrl = 'https://api.dexscreener.com/latest';
  }

  async getNewTokens(chain = 'bsc') {
    try {
      const res = await axios.get(
        `${this.baseUrl}/dex/tokens/trending/${chain}`,
        { timeout: 10000 }
      );
      return res.data?.pairs || [];
    } catch (e) {
      // 尝试备用端点
      return this.getLatestPairs(chain);
    }
  }

  async getLatestPairs(chain = 'bsc') {
    try {
      const res = await axios.get(
        `${this.baseUrl}/dex/pairs/${chain}`,
        { timeout: 10000 }
      );
      return res.data?.pairs || [];
    } catch (e) {
      console.error('DexScreener 获取失败:', e.message);
      return [];
    }
  }

  async searchToken(query) {
    try {
      const res = await axios.get(
        `${this.baseUrl}/dex/search?q=${query}`,
        { timeout: 10000 }
      );
      return res.data?.pairs || [];
    } catch (e) {
      return [];
    }
  }
}

module.exports = DexScreener;
