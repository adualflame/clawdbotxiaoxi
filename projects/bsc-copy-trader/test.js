// 测试脚本 - 检查目标钱包最近交易
const axios = require('axios');

const TARGET = '0xa83b73f5644cde337b61da79589f10ea15548811';

async function test() {
  console.log('🔍 测试获取目标钱包交易...\n');
  
  // 使用 BSCScan API（国内可访问）
  const url = `https://api.bscscan.com/api?module=account&action=txlist&address=${TARGET}&page=1&offset=5&sort=desc&apikey=QQ6NFW9VF9EXB28VRJWQH23KYNDIFFWPRH`;
  
  const res = await axios.get(url);
  
  if (res.data.status === '1') {
    console.log('✅ 连接成功！最近 5 笔交易：\n');
    res.data.result.forEach((tx, i) => {
      const time = new Date(tx.timeStamp * 1000).toLocaleString('zh-CN');
      console.log(`${i+1}. ${time}`);
      console.log(`   Hash: ${tx.hash.slice(0,20)}...`);
      console.log(`   To: ${tx.to?.slice(0,20)}...`);
      console.log('');
    });
  } else {
    console.log('❌ 获取失败:', res.data.message);
  }
}

test().catch(console.error);
