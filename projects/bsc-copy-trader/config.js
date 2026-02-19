require('dotenv').config();

module.exports = {
  // 目标钱包
  targetWallet: process.env.TARGET_WALLET,
  
  // 你的钱包
  privateKey: process.env.PRIVATE_KEY,
  
  // API
  bscscanApiKey: process.env.BSCSCAN_API_KEY,
  noderealApiKey: process.env.NODEREAL_API_KEY,
  bscRpcUrl: process.env.BSC_RPC_URL || 'https://bsc-dataseed1.binance.org',
  
  // 跟单参数
  copyPercentage: parseFloat(process.env.COPY_PERCENTAGE) || 100,
  maxBuyBnb: parseFloat(process.env.MAX_BUY_AMOUNT_BNB) || 0.1,
  minBuyBnb: parseFloat(process.env.MIN_BUY_AMOUNT_BNB) || 0.01,
  slippage: parseFloat(process.env.SLIPPAGE) || 15,
  
  // 监控
  pollInterval: parseInt(process.env.POLL_INTERVAL) || 3000,
  
  // 合约地址
  contracts: {
    pancakeRouter: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    wbnb: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
  }
};
