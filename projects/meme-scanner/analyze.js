// analyze.js - Meme Coin 分析脚本
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const GOPLUS_API = 'https://api.gopluslabs.io/api/v1/token_security';
const CHAIN_IDS = { 'bsc': '56', 'eth': '1', 'polygon': '137' };

// 查询链上安全数据
async function getTokenSecurity(address, chain = 'bsc') {
  const chainId = CHAIN_IDS[chain] || '56';
  try {
    const res = await axios.get(`${GOPLUS_API}/${chainId}?contract_addresses=${address}`, { timeout: 15000 });
    if (res.data.code === 1) return res.data.result[address.toLowerCase()];
  } catch (e) { console.error('GoPlus 查询失败:', e.message); }
  return null;
}

// 搜索 Twitter 热度 (外部传入)
async function searchTwitter(symbol, name) {
  // Twitter 搜索由外部完成，这里只返回默认值
  // 可通过环境变量 TWITTER_FOUND=1 传入结果
  const hasTwitter = process.env.TWITTER_FOUND === '1';
  return { hasTwitter, resultCount: hasTwitter ? 3 : 0 };
}

// 计算评分
function calcScores(data, twitterData = {}) {
  let security = 0, liquidity = 0, heat = 0, timing = 10;
  
  // 安全 (30分)
  if (data.is_open_source === '1') security += 5;
  if (data.is_honeypot === '0') security += 8;
  if (data.is_mintable === '0') security += 4;
  if (data.hidden_owner === '0') security += 4;
  if (data.can_take_back_ownership === '0') security += 3;
  if (data.selfdestruct === '0') security += 3;
  if (data.transfer_pausable === '0') security += 3;
  
  // 流动性 (25分)
  const totalLiq = data.dex?.reduce((s, d) => s + parseFloat(d.liquidity || 0), 0) || 0;
  if (totalLiq > 500000) liquidity = 25;
  else if (totalLiq > 200000) liquidity = 20;
  else if (totalLiq > 100000) liquidity = 15;
  else if (totalLiq > 50000) liquidity = 10;
  else if (totalLiq > 10000) liquidity = 5;
  
  // 热度 (25分) - 加入 Twitter
  const holders = parseInt(data.holder_count) || 0;
  if (holders > 5000) heat += 10;
  else if (holders > 2000) heat += 8;
  else if (holders > 500) heat += 5;
  else if (holders > 100) heat += 3;
  
  // Twitter 热度加分
  if (twitterData.hasTwitter) heat += 8;
  if (twitterData.resultCount >= 3) heat += 7;
  else if (twitterData.resultCount >= 1) heat += 4;
  
  // 时机 (20分)
  const creatorPct = parseFloat(data.creator_percent) || 0;
  if (holders >= 100 && holders <= 2000) timing += 5;
  if (creatorPct < 0.01) timing += 5;
  else if (creatorPct < 0.05) timing += 3;
  
  return { security, liquidity, heat, timing, total: security + liquidity + heat + timing, totalLiq };
}

// 生成报告
function generateReport(address, chain, data, scores, twitterData = {}) {
  const liq = scores.totalLiq > 1000 ? `$${(scores.totalLiq/1000).toFixed(0)}k` : `$${scores.totalLiq.toFixed(0)}`;
  let advice, emoji;
  if (scores.total >= 70) { advice = '可小仓位关注'; emoji = '🟡'; }
  else if (scores.total >= 50) { advice = '谨慎观望'; emoji = '🟠'; }
  else { advice = '不建议买入'; emoji = '🔴'; }
  
  const twitterStatus = twitterData.hasTwitter ? '有官方推特 ✅' : '未发现推特 ⚠️';

  return `🔍 ${data.token_symbol} 分析报告

基本信息
- 代币：${data.token_name} (${data.token_symbol})
- 链：${chain.toUpperCase()}
- 合约：\`${address}\`

🎯 综合评分：${scores.total}/100
- 安全性 ${scores.security}/30 | 流动性 ${scores.liquidity}/25
- 热度 ${scores.heat}/25 | 时机 ${scores.timing}/20

📊 链上数据
- 持有人：${data.holder_count}
- 流动性：${liq}
- 买税：${(parseFloat(data.buy_tax)*100).toFixed(0)}% | 卖税：${(parseFloat(data.sell_tax)*100).toFixed(0)}%

🐦 社区热度
- ${twitterStatus}

✅ 安全检测
- 开源 ${data.is_open_source==='1'?'✅':'❌'} | 非貔貅 ${data.is_honeypot==='0'?'✅':'❌'} | 不可增发 ${data.is_mintable==='0'?'✅':'❌'}

💡 建议：${advice} ${emoji}`;
}

// 记录到文件
function saveRecord(address, chain, data, scores) {
  const file = path.join(__dirname, 'token-records.md');
  const date = new Date().toISOString().split('T')[0];
  const advice = scores.total >= 70 ? '🟡' : scores.total >= 50 ? '🟠' : '🔴';
  
  const record = `
### ${data.token_symbol}
- 合约：\`${address}\`
- 链：${chain.toUpperCase()}
- 评分：${scores.total}/100
- 建议：${advice}
- 时间：${new Date().toLocaleString('zh-CN')}
`;
  fs.appendFileSync(file, record);
}

// 主函数
async function analyze(address, chain = 'bsc') {
  console.log(`分析中: ${address}`);
  
  // 并行查询链上数据和 Twitter
  const [data, twitterData] = await Promise.all([
    getTokenSecurity(address, chain),
    (async () => {
      const temp = await getTokenSecurity(address, chain);
      if (temp) return searchTwitter(temp.token_symbol, temp.token_name);
      return { results: [], hasTwitter: false };
    })()
  ]);
  
  if (!data) {
    console.log('❌ 无法获取代币数据');
    return null;
  }
  
  // 重新搜索 Twitter（因为并行时可能还没拿到 symbol）
  const twitter = await searchTwitter(data.token_symbol, data.token_name);
  
  const scores = calcScores(data, twitter);
  const report = generateReport(address, chain, data, scores, twitter);
  saveRecord(address, chain, data, scores);
  
  // 高分预警
  if (scores.total >= 75) {
    console.log('\n🔥🔥🔥 高分预警！评分≥75，值得重点关注！🔥🔥🔥\n');
  }
  
  console.log(report);
  return { data, scores, report };
}

// CLI 入口
if (require.main === module) {
  const addr = process.argv[2];
  const chain = process.argv[3] || 'bsc';
  
  if (!addr) {
    console.log('用法: node analyze.js <合约地址> [链]');
    process.exit(1);
  }
  
  analyze(addr, chain);
}

module.exports = { analyze };
