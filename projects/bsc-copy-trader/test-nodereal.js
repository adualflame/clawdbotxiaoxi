const axios = require('axios');

const API_KEY = 'f3eda1383c8545c49e311cdb1f258712';
const TARGET = '0xa83b73f5644cde337b61da79589f10ea15548811';
const URL = `https://bsc-mainnet.nodereal.io/v1/${API_KEY}`;

async function test() {
  console.log('🔍 测试 NodeReal API...\n');
  
  const res = await axios.post(URL, {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_getBlockNumber',
    params: []
  });
  
  console.log('✅ 当前区块:', parseInt(res.data.result, 16));
  
  // 测试获取交易
  const txRes = await axios.post(URL, {
    jsonrpc: '2.0',
    id: 2,
    method: 'nr_getTransactionsByAddress',
    params: [TARGET, 5, 'desc']
  });
  
  if (txRes.data.result) {
    console.log('\n✅ 最近交易:', txRes.data.result.length, '笔');
  } else {
    console.log('\n⚠️ 交易查询返回:', txRes.data);
  }
}

test().catch(e => console.error('❌ 错误:', e.message));
