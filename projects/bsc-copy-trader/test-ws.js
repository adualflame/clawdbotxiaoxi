const { ethers } = require('ethers');

async function test() {
  console.log('🔌 测试 BSC WebSocket 连接...\n');
  
  const wsUrl = 'wss://bsc-ws-node.nariox.org:443';
  
  try {
    const provider = new ethers.WebSocketProvider(wsUrl);
    
    const blockNumber = await provider.getBlockNumber();
    console.log(`✅ 连接成功! 当前区块: ${blockNumber}`);
    
    const balance = await provider.getBalance(
      '0xa83b73f5644cde337b61da79589f10ea15548811'
    );
    console.log(`💰 目标钱包余额: ${ethers.formatEther(balance)} BNB`);
    
    provider.destroy();
    process.exit(0);
  } catch (e) {
    console.error('❌ 连接失败:', e.message);
    process.exit(1);
  }
}

test();
