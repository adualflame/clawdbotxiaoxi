const axios = require('axios');
const { ethers } = require('ethers');
const config = require('./config');

class WalletMonitor {
  constructor() {
    this.lastTxHash = null;
    this.processedTxs = new Set();
    this.provider = new ethers.JsonRpcProvider(config.bscRpcUrl);
    this.lastBlock = 0;
  }

  async getLatestTransactions() {
    // 使用 NodeReal Enhanced API 获取交易历史
    const url = `https://bsc-mainnet.nodereal.io/v1/${config.noderealApiKey}`;
    
    try {
      const response = await axios.post(url, {
        jsonrpc: '2.0',
        id: 1,
        method: 'nr_getTransactionsByAddress',
        params: [config.targetWallet, 20, 'desc']
      });
      
      if (response.data.result) {
        return response.data.result;
      }
      return [];
    } catch (error) {
      console.error('获取交易失败:', error.message);
      return [];
    }
  }

  async getTokenTransfers() {
    // 使用 NodeReal Enhanced API 获取代币转账
    const url = `https://bsc-mainnet.nodereal.io/v1/${config.noderealApiKey}`;
    
    try {
      const response = await axios.post(url, {
        jsonrpc: '2.0',
        id: 1,
        method: 'nr_getTokenTransfers20ByAddress',
        params: [config.targetWallet, null, 20, 'desc']
      });
      
      if (response.data.result) {
        return response.data.result;
      }
      return [];
    } catch (error) {
      console.error('获取代币转账失败:', error.message);
      return [];
    }
  }

  parseSwapTransaction(tx, tokenTransfers) {
    // 判断是买入还是卖出
    const relatedTransfers = tokenTransfers.filter(t => t.hash === tx.hash);
    
    if (relatedTransfers.length === 0) return null;
    
    const wbnbAddress = config.contracts.wbnb.toLowerCase();
    
    for (const transfer of relatedTransfers) {
      const isBuy = transfer.to.toLowerCase() === config.targetWallet.toLowerCase() 
                    && transfer.contractAddress.toLowerCase() !== wbnbAddress;
      const isSell = transfer.from.toLowerCase() === config.targetWallet.toLowerCase()
                    && transfer.contractAddress.toLowerCase() !== wbnbAddress;
      
      if (isBuy) {
        return {
          type: 'BUY',
          token: transfer.contractAddress,
          tokenSymbol: transfer.tokenSymbol,
          amount: transfer.value,
          decimals: transfer.tokenDecimal,
          txHash: tx.hash
        };
      }
      
      if (isSell) {
        return {
          type: 'SELL',
          token: transfer.contractAddress,
          tokenSymbol: transfer.tokenSymbol,
          amount: transfer.value,
          decimals: transfer.tokenDecimal,
          txHash: tx.hash
        };
      }
    }
    return null;
  }
}

module.exports = WalletMonitor;
