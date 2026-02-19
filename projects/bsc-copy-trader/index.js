const WalletMonitor = require('./monitor');
const Trader = require('./trader');
const config = require('./config');

const monitor = new WalletMonitor();
const trader = new Trader();

console.log('🚀 BSC Copy Trader 启动');
console.log(`📍 跟踪钱包: ${config.targetWallet}`);
console.log(`💰 最大买入: ${config.maxBuyBnb} BNB`);
console.log(`⏱️ 轮询间隔: ${config.pollInterval}ms`);
console.log('-----------------------------------');

async function main() {
  const processedTxs = new Set();
  
  while (true) {
    try {
      const [txs, transfers] = await Promise.all([
        monitor.getLatestTransactions(),
        monitor.getTokenTransfers()
      ]);

      for (const tx of txs) {
        if (processedTxs.has(tx.hash)) continue;
        
        const swap = monitor.parseSwapTransaction(tx, transfers);
        if (!swap) continue;
        
        processedTxs.add(tx.hash);
        console.log(`\n🔔 检测到交易: ${swap.type} ${swap.tokenSymbol}`);
        console.log(`   Token: ${swap.token}`);
        console.log(`   TxHash: ${swap.txHash}`);
        
        if (swap.type === 'BUY') {
          await trader.buyToken(swap.token, config.maxBuyBnb);
        } else if (swap.type === 'SELL') {
          await trader.sellToken(swap.token, 100);
        }
      }
    } catch (error) {
      console.error('轮询错误:', error.message);
    }
    
    await new Promise(r => setTimeout(r, config.pollInterval));
  }
}

main().catch(console.error);
