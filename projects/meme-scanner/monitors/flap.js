const { ethers } = require('ethers');

class FlapMonitor {
  constructor(rpcUrl) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    // Flap.sh 合约地址
    this.factoryAddress = '0x1de460f363AF910f51726DEf188F9004276Bf4bc';
    this.seenTokens = new Set();
  }

  async getNewTokens() {
    try {
      const block = await this.provider.getBlockNumber();
      const logs = await this.provider.getLogs({
        address: this.factoryAddress,
        fromBlock: block - 1000,
        toBlock: block
      });
      
      const tokens = logs.map(log => ({
        address: '0x' + log.topics[1]?.slice(26),
        platform: 'flap',
        blockNumber: log.blockNumber
      })).filter(t => t.address?.length === 42);
      
      return tokens;
    } catch (e) {
      console.error('Flap 获取失败:', e.message);
      return [];
    }
  }
}

module.exports = FlapMonitor;
