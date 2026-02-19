const { ethers } = require('ethers');
const WSMonitor = require('./ws-monitor');
const Trader = require('./trader');
const config = require('./config');

const monitor = new WSMonitor();
const trader = new Trader();

console.log('🚀 BSC Copy Trader (WebSocket) 启动');
console.log(`📍 跟踪钱包: ${config.targetWallet}`);
console.log(`💰 最大买入: ${config.maxBuyBnb} BNB`);
console.log('-----------------------------------\n');

async function main() {
  await monitor.connect();
  
  monitor.watchPendingTxs(config.targetWallet, async (swap) => {
    console.log(`⚡ ${swap.type} 信号!`);
    console.log(`   Token: ${swap.token}`);
    
    if (swap.type === 'BUY') {
      const bnbAmount = Math.min(
        config.maxBuyBnb,
        parseFloat(ethers.formatEther(swap.value || 0))
      );
      await trader.buyToken(swap.token, bnbAmount || config.maxBuyBnb);
    } else if (swap.type === 'SELL') {
      await trader.sellToken(swap.token, 100);
    }
  });
}

main().catch(console.error);
