const { ethers } = require('ethers');
const config = require('./config');

class WSMonitor {
  constructor() {
    this.wsUrls = [
      'wss://bsc-rpc.publicnode.com',
      'wss://bsc.drpc.org',
      'wss://fabled-methodical-county.bsc.quiknode.pro/24bd8a874653161f82c4d145b277ca040828de2b'
    ];
    this.currentUrlIndex = 0;
    this.provider = null;
    this.processedTxs = new Set();
    this.reconnectDelay = 5000;
  }

  async connect() {
    const wsUrl = this.wsUrls[this.currentUrlIndex];
    console.log(`🔌 连接 BSC WebSocket... (${wsUrl})`);
    
    this.provider = new ethers.WebSocketProvider(wsUrl);
    
    this.provider.websocket.on('open', () => {
      console.log('✅ WebSocket 已连接');
      this.reconnectDelay = 5000; // 重置延迟
    });
    
    this.provider.websocket.on('error', (err) => {
      console.error('❌ WebSocket 错误:', err.message);
    });
    
    this.provider.websocket.on('close', () => {
      // 切换节点
      this.currentUrlIndex = (this.currentUrlIndex + 1) % this.wsUrls.length;
      console.log(`⚠️ 断开，${this.reconnectDelay/1000}秒后重连...`);
      
      setTimeout(() => this.connect(), this.reconnectDelay);
      // 指数退避，最大60秒
      this.reconnectDelay = Math.min(this.reconnectDelay * 1.5, 60000);
    });
    
    return this.provider;
  }

  async watchPendingTxs(targetWallet, onSwapDetected) {
    const target = targetWallet.toLowerCase();
    console.log(`👀 监控钱包: ${target}`);
    
    this.provider.on('pending', async (txHash) => {
      if (this.processedTxs.has(txHash)) return;
      
      try {
        const tx = await this.provider.getTransaction(txHash);
        if (!tx) return;
        
        const from = tx.from?.toLowerCase();
        if (from !== target) return;
        
        this.processedTxs.add(txHash);
        console.log(`\n🔔 检测到目标钱包交易!`);
        console.log(`   Hash: ${txHash}`);
        
        const swap = this.parseSwapData(tx);
        if (swap) {
          onSwapDetected(swap);
        }
      } catch (e) {
        // 忽略获取失败的交易
      }
    });
  }

  parseSwapData(tx) {
    if (!tx.data || tx.data.length < 10) return null;
    
    const selector = tx.data.slice(0, 10);
    const value = tx.value;
    
    // 目标钱包的聚合合约
    const AGGREGATOR = '0x1de460f363af910f51726def188f9004276bf4bc';
    
    // 聚合合约交易 - 直接从 calldata 解析 token
    if (tx.to?.toLowerCase() === AGGREGATOR.toLowerCase()) {
      console.log(`   合约: 聚合器`);
      console.log(`   Selector: ${selector}`);
      
      // Token 地址在 calldata 位置 546 (0x + 544字符后的40字符)
      let token = null;
      if (tx.data.length >= 586) {
        token = '0x' + tx.data.slice(546, 586);
        console.log(`   Token: ${token}`);
      }
      
      // 有 BNB 发送 = 买入
      if (value > 0n) {
        const bnbAmount = require('ethers').formatEther(value);
        console.log(`   Value: ${bnbAmount} BNB (买入)`);
        return { type: 'BUY', token, value, txHash: tx.hash };
      } else {
        console.log(`   Value: 0 (卖出)`);
        return { type: 'SELL', token, txHash: tx.hash };
      }
    }
    
    // PancakeSwap 标准方法
    const BUY_SELECTORS = [
      '0x7ff36ab5', // swapExactETHForTokens
      '0xb6f9de95'  // swapExactETHForTokensSupportingFeeOnTransferTokens
    ];
    
    const SELL_SELECTORS = [
      '0x18cbafe5', // swapExactTokensForETH
      '0x791ac947'  // swapExactTokensForETHSupportingFeeOnTransferTokens
    ];

    try {
      if (BUY_SELECTORS.includes(selector)) {
        const token = this.extractTokenFromPath(tx.data, 'buy');
        return { type: 'BUY', token, value: tx.value, txHash: tx.hash };
      }
      
      if (SELL_SELECTORS.includes(selector)) {
        const token = this.extractTokenFromPath(tx.data, 'sell');
        return { type: 'SELL', token, txHash: tx.hash };
      }
    } catch (e) {
      console.error('解析失败:', e.message);
    }
    
    return null;
  }

  extractTokenFromPath(data, type) {
    // path 在 calldata 中的位置，跳过 selector (4 bytes)
    // 解析动态数组获取 token 地址
    const pathOffset = parseInt(data.slice(74, 138), 16) * 2 + 10;
    const pathLength = parseInt(data.slice(pathOffset, pathOffset + 64), 16);
    
    // 买入: path[last] 是目标 token
    // 卖出: path[0] 是目标 token
    if (type === 'buy') {
      const lastIndex = pathOffset + 64 + (pathLength - 1) * 64;
      return '0x' + data.slice(lastIndex + 24, lastIndex + 64);
    } else {
      const firstIndex = pathOffset + 64;
      return '0x' + data.slice(firstIndex + 24, firstIndex + 64);
    }
  }
}

module.exports = WSMonitor;