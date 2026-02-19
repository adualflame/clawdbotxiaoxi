const DexScreener = require('./monitors/dexscreener');
const config = require('./config.json');

console.log('='.repeat(50));
console.log('🔍 Meme Coin Scanner v0.2');
console.log('='.repeat(50));

const dex = new DexScreener();

async function scan() {
  console.log('\n⏰', new Date().toLocaleString('zh-CN'), '扫描中...\n');
  
  try {
    // 搜索 BSC 上的新币
    const pairs = await dex.searchToken('bsc');
    
    // 过滤24小时内创建的
    const newPairs = pairs.filter(p => {
      const age = Date.now() - (p.pairCreatedAt || 0);
      return age < 24 * 60 * 60 * 1000;
    });
    
    console.log(`📊 找到 ${newPairs.length} 个新交易对\n`);
    return newPairs;
  } catch (e) {
    console.error('扫描失败:', e.message);
    return [];
  }
}

function printReport(pairs) {
  if (pairs.length === 0) {
    console.log('暂无新币\n');
    return;
  }
  
  console.log('📋 Top 5 新币:\n');
  pairs.slice(0, 5).forEach((p, i) => {
    const name = p.baseToken?.name || 'N/A';
    const symbol = p.baseToken?.symbol || 'N/A';
    const price = p.priceUsd || '0';
    const liq = p.liquidity?.usd || 0;
    const vol = p.volume?.h24 || 0;
    
    console.log(`${i+1}. ${symbol} (${name})`);
    console.log(`   价格: $${price}`);
    console.log(`   流动性: $${Math.round(liq)}`);
    console.log(`   24h量: $${Math.round(vol)}`);
    console.log('');
  });
}

async function main() {
  console.log('✅ 扫描器启动\n');
  
  const pairs = await scan();
  printReport(pairs);
}

main().catch(console.error);
