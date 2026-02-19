const axios = require('axios');
const { ethers } = require('ethers');

class FourMemeMonitor {
  constructor(rpcUrl) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    // Four.meme 合约地址
    this.factoryAddress = '0x5c952063c7fc8610FFDB798152D69F0B9550762b';
    this.seenTokens = new Set();
  }

  async getNewTokens() {
    try {
      // 监听最近区块的 TokenCreated 事件
      const block = await this.provider.getBlockNumber();
      const logs = await this.provider.getLogs({
        address: this.factoryAddress,
        fromBlock: block - 1000,
        toBlock: block
      });
      
      const tokens = logs.map(log => ({
        address: '0x' + log.topics[1]?.slice(26),
        platform: 'fourmeme',
        blockNumber: log.blockNumber
      })).filter(t => t.address.length === 42);
      
      return tokens;
    } catch (e) {
      console.error('FourMeme 获取失败:', e.message);
      return [];
    }
  }
}

module.exports = FourMemeMonitor;
