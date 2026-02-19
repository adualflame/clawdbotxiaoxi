const { ethers } = require('ethers');

const TARGET = '0xa83b73f5644cde337b61da79589f10ea15548811';

async function test() {
  console.log('🚀 BSC WebSocket 监控测试');
  console.log(`📍 目标钱包: ${TARGET}\n`);
  
  const provider = new ethers.WebSocketProvider('wss://bsc.publicnode.com');
  
  const block = await provider.getBlockNumber();
  console.log(`✅ 已连接! 区块: ${block}`);
  
  const balance = await provider.getBalance(TARGET);
  console.log(`💰 目标余额: ${ethers.formatEther(balance)} BNB\n`);
  
  console.log('👀 监听新区块 (等待10秒)...\n');
  
  let count = 0;
  provider.on('block', (num) => {
    console.log(`📦 新区块: ${num}`);
    count++;
    if (count >= 3) {
      console.log('\n✅ 测试完成!');
      provider.destroy();
      process.exit(0);
    }
  });
  
  setTimeout(() => {
    provider.destroy();
    process.exit(0);
  }, 15000);
}

test();
