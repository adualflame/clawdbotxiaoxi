// track.js - 代币追踪脚本
const fs = require('fs');
const path = require('path');

const TRACKING_FILE = path.join(__dirname, 'tracking.json');

// 读取追踪数据
function loadTracking() {
  if (fs.existsSync(TRACKING_FILE)) {
    return JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf8'));
  }
  return { tokens: [], lastWeeklyReport: null, lastMonthlyReport: null };
}

// 保存追踪数据
function saveTracking(data) {
  fs.writeFileSync(TRACKING_FILE, JSON.stringify(data, null, 2));
}

// 添加代币记录
function addToken(symbol, address, chain, score, liquidity) {
  const data = loadTracking();
  data.tokens.push({
    symbol,
    address,
    chain,
    score,
    initialLiquidity: liquidity,
    addedAt: new Date().toISOString(),
    priceHistory: []
  });
  saveTracking(data);
  console.log(`✅ 已添加追踪: ${symbol}`);
}

// 生成周报
function generateWeeklyReport() {
  const data = loadTracking();
  const now = new Date();
  
  let report = `# 周报 ${now.toLocaleDateString('zh-CN')}\n\n`;
  report += `| 代币 | 评分 | 初始流动性 | 当前状态 | 建议 |\n`;
  report += `|------|------|------------|----------|------|\n`;
  
  for (const token of data.tokens) {
    const advice = token.score >= 70 ? '持有观察' : '谨慎';
    report += `| ${token.symbol} | ${token.score} | $${token.initialLiquidity} | 待更新 | ${advice} |\n`;
  }
  
  data.lastWeeklyReport = now.toISOString();
  saveTracking(data);
  
  console.log(report);
  return report;
}

// 止损检查
function checkStopLoss(symbol, currentLiq) {
  const data = loadTracking();
  const token = data.tokens.find(t => t.symbol === symbol);
  if (!token) return null;
  
  const change = ((currentLiq - token.initialLiquidity) / token.initialLiquidity) * 100;
  
  if (change <= -50) {
    console.log(`\n⚠️ 止损提醒！${symbol} 跌幅已超50%（${change.toFixed(1)}%）⚠️\n`);
    return { alert: true, change };
  }
  return { alert: false, change };
}

// CLI 入口
if (require.main === module) {
  const cmd = process.argv[2];
  
  if (cmd === 'add') {
    const [,, , symbol, addr, chain, score, liq] = process.argv;
    addToken(symbol, addr, chain || 'bsc', parseInt(score), parseFloat(liq));
  } else if (cmd === 'weekly') {
    generateWeeklyReport();
  } else if (cmd === 'list') {
    const data = loadTracking();
    console.log(`追踪中: ${data.tokens.length} 个代币`);
    data.tokens.forEach(t => console.log(`- ${t.symbol} (${t.score}分)`));
  } else if (cmd === 'check') {
    const [,, , symbol, currentLiq] = process.argv;
    checkStopLoss(symbol, parseFloat(currentLiq));
  } else {
    console.log('用法: node track.js <add|weekly|list|check>');
  }
}

module.exports = { addToken, generateWeeklyReport, loadTracking, checkStopLoss };
