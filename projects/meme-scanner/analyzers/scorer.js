class Scorer {
  constructor() {
    this.weights = {
      twitterMentions: 30,
      holders: 20,
      liquidity: 25,
      age: 15,
      platform: 10
    };
  }

  calculate(token, social) {
    let score = 0;
    
    // Twitter 热度 (0-30分)
    const mentions = social?.mentions || 0;
    score += Math.min(mentions * 3, 30);
    
    // 持有人数 (0-20分)
    const holders = token.holders || 0;
    score += Math.min(holders / 5, 20);
    
    // 流动性 (0-25分)
    const liq = token.liquidity || 0;
    score += Math.min(liq / 1000, 25);
    
    // 新鲜度 (0-15分)
    const ageHours = token.ageHours || 24;
    score += Math.max(15 - ageHours, 0);
    
    // 平台加成 (0-10分)
    if (token.platform === 'flap') score += 10;
    if (token.platform === 'fourmeme') score += 8;
    
    return Math.round(score);
  }
}

module.exports = Scorer;
