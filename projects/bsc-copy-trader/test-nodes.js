const { ethers } = require('ethers');

const nodes = [
  'wss://bsc.publicnode.com',
  'wss://bsc-rpc.publicnode.com', 
  'wss://binance.llamarpc.com'
];

async function testNode(url) {
  console.log(`测试: ${url}`);
  try {
    const provider = new ethers.WebSocketProvider(url);
    const block = await Promise.race([
      provider.getBlockNumber(),
      new Promise((_, rej) => setTimeout(() => rej('timeout'), 8000))
    ]);
    console.log(`  ✅ 成功! 区块: ${block}\n`);
    provider.destroy();
    return true;
  } catch (e) {
    console.log(`  ❌ 失败: ${e}\n`);
    return false;
  }
}

async function main() {
  for (const url of nodes) {
    await testNode(url);
  }
  process.exit(0);
}

main();
