const { ethers } = require('ethers');
const config = require('./config');

const ROUTER_ABI = [
  'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] path, address to, uint deadline) payable',
  'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline)',
  'function getAmountsOut(uint amountIn, address[] path) view returns (uint[] amounts)'
];

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)'
];

class Trader {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(config.bscRpcUrl);
    this.wallet = new ethers.Wallet(config.privateKey, this.provider);
    this.router = new ethers.Contract(
      config.contracts.pancakeRouter,
      ROUTER_ABI,
      this.wallet
    );
  }

  async buyToken(tokenAddress, amountBnb) {
    console.log(`🟢 买入 ${tokenAddress}, 金额: ${amountBnb} BNB`);
    
    const path = [config.contracts.wbnb, tokenAddress];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 5;
    const amountIn = ethers.parseEther(amountBnb.toString());
    
    try {
      const tx = await this.router.swapExactETHForTokensSupportingFeeOnTransferTokens(
        0,
        path,
        this.wallet.address,
        deadline,
        {
          value: amountIn,
          gasLimit: 300000,
          gasPrice: ethers.parseUnits('10', 'gwei')
        }
      );
      
      console.log(`📤 交易已发送: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`✅ 买入成功! Gas: ${receipt.gasUsed}`);
      return receipt;
    } catch (error) {
      console.error(`❌ 买入失败:`, error.message);
      return null;
    }
  }

  async sellToken(tokenAddress, percentage = 100) {
    console.log(`🔴 卖出 ${tokenAddress}, 比例: ${percentage}%`);
    
    const token = new ethers.Contract(tokenAddress, ERC20_ABI, this.wallet);
    const balance = await token.balanceOf(this.wallet.address);
    
    if (balance === 0n) {
      console.log('⚠️ 余额为0，跳过卖出');
      return null;
    }
    
    const sellAmount = balance * BigInt(percentage) / 100n;
    const path = [tokenAddress, config.contracts.wbnb];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 5;
    
    try {
      // 先授权
      const allowance = await token.allowance(
        this.wallet.address, 
        config.contracts.pancakeRouter
      );
      if (allowance < sellAmount) {
        console.log('🔓 授权中...');
        const approveTx = await token.approve(
          config.contracts.pancakeRouter, 
          ethers.MaxUint256
        );
        await approveTx.wait();
      }
      
      const tx = await this.router.swapExactTokensForETHSupportingFeeOnTransferTokens(
        sellAmount,
        0,
        path,
        this.wallet.address,
        deadline,
        { gasLimit: 300000, gasPrice: ethers.parseUnits('10', 'gwei') }
      );
      
      console.log(`📤 交易已发送: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`✅ 卖出成功!`);
      return receipt;
    } catch (error) {
      console.error(`❌ 卖出失败:`, error.message);
      return null;
    }
  }
}

module.exports = Trader;
