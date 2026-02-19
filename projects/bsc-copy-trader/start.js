const WSMonitor = require('./ws-monitor');
const Trader = require('./trader');
const config = require('./config');
const { ethers } = require('ethers');

console.log('='.repeat(50));
console.log('🤖 BSC 跟单机器人 (WebSocket 版)');
console.log('='.repeat(50));
console.log(`📍 目标钱包: ${config.targetWallet}`);
console.log(`💰 单笔最大: ${config.maxBuyBnb} BNB`);
console.log(`📊 滑点: ${config.slippage}%`);
console.log('='.repeat(50));

const monitor = new WSMonitor();
const trader = new Trader();
const provider = new ethers.JsonRpcProvider(config.bscRpcUrl);

// ERC20 Transfer 事件签名
const TRANSFER_TOPIC = ethers.id('Transfer(address,address,uint256)');
const WBNB = config.contracts.wbnb.toLowerCase();

// 从交易回执解析 token (买入看转入，卖出看转出)
async function parseTokenFromReceipt(txHash, type = 'BUY') {
  try {
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) return null;
    
    const target = config.targetWallet.toLowerCase();
    
    for (const log of receipt.logs) {
      if (log.topics[0] !== TRANSFER_TOPIC) continue;
      
      const tokenAddr = log.address.toLowerCase();
      if (tokenAddr === WBNB) continue;
      
      const from = '0x' + log.topics[1].slice(26).toLowerCase();
      const to = '0x' + log.topics[2].slice(26).toLowerCase();
      
      // 买入: token 转给目标钱包
      if (type === 'BUY' && to === target) {
        return log.address;
      }
      // 卖出: token 从目标钱包转出
      if (type === 'SELL' && from === target) {
        return log.address;
      }
    }
  } catch (e) {
    console.error('解析回执失败:', e.message);
  }
  return null;
}

async function onSwapDetected(swap) {
  console.log(`\n${'='.repeat(40)}`);
  console.log(`🎯 检测到 ${swap.type} 操作!`);
  console.log(`   原始交易: ${swap.txHash}`);
  
  let token = swap.token;
  
  // 检查 token 是否有效
  if (!token || token.length !== 42) {
    console.log('   ⚠️ 无效 token，跳过');
    return;
  }
  
  console.log(`   Token: ${token}`);
  
  if (swap.type === 'BUY') {
    const amount = config.maxBuyBnb;
    console.log(`\n⚡ 跟单买入 ${amount} BNB...`);
    await trader.buyToken(token, amount);
  } 
  else if (swap.type === 'SELL') {
    console.log(`\n⚡ 跟单卖出...`);
    await trader.sellToken(token, 100);
  }
  
  console.log('='.repeat(40));
}

async function main() {
  try {
    await monitor.connect();
    await monitor.watchPendingTxs(config.targetWallet, onSwapDetected);
    console.log('\n✅ 监控已启动，等待目标钱包交易...\n');
  } catch (err) {
    console.error('❌ 启动失败:', err.message);
    process.exit(1);
  }
}

main();