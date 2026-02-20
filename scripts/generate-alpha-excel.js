const XLSX = require('xlsx');

const ratings = [
  // A级
  { '代币': 'HYPE', '项目名': 'Hyperliquid', '赛道': 'DeFi/永续', '链': 'HyperEVM', '总分': 84, '等级': 'A', '建议': '永续DEX龙头' },
  { '代币': 'SOL', '项目名': 'Solana', '赛道': 'L1', '链': 'Solana', '总分': 88, '等级': 'A', '建议': '生态龙头' },
  { '代币': 'TAO', '项目名': 'Bittensor', '赛道': 'AI/计算', '链': 'Bittensor', '总分': 82, '等级': 'A', '建议': 'AI去中心化计算' },
  { '代币': 'ONDO', '项目名': 'Ondo Finance', '赛道': 'RWA', '链': 'ETH', '总分': 81, '等级': 'A-', '建议': 'RWA龙头' },
  // B+级
  { '代币': 'SUI', '项目名': 'Sui', '赛道': 'L1', '链': 'Sui', '总分': 79, '等级': 'B+', '建议': '新L1潜力' },
  { '代币': 'MNT', '项目名': 'Mantle', '赛道': 'L2', '链': 'ETH', '总分': 78, '等级': 'B+', '建议': 'L2稳健' },
  { '代币': 'JUP', '项目名': 'Jupiter', '赛道': 'DEX', '链': 'Solana', '总分': 77, '等级': 'B+', '建议': 'Solana聚合器龙头' },
  { '代币': 'UXLINK', '项目名': 'UXLINK', '赛道': 'SocialFi', '链': 'Multi', '总分': 76, '等级': 'B+', '建议': '社交赛道' },
  { '代币': 'PENGU', '项目名': 'Pudgy Penguins', '赛道': 'NFT/Meme', '链': 'SOL', '总分': 75, '等级': 'B+', '建议': 'NFT龙头IP' },
  // B级
  { '代币': 'APX', '项目名': 'ApolloX', '赛道': 'DeFi/衍生品', '链': 'BSC', '总分': 74, '等级': 'B', '建议': '衍生品稳健' },
  { '代币': 'VIRTUAL', '项目名': 'Virtual Protocol', '赛道': 'AI', '链': 'Base', '总分': 74, '等级': 'B', '建议': 'AI热门' },
  { '代币': 'AIXBT', '项目名': 'AIXBT', '赛道': 'AI', '链': 'Base', '总分': 73, '等级': 'B', '建议': 'AI概念' },
  { '代币': 'ARB', '项目名': 'Arbitrum', '赛道': 'L2', '链': 'ETH', '总分': 72, '等级': 'B', '建议': 'L2龙头之一' },
  { '代币': 'ME', '项目名': 'Magic Eden', '赛道': 'NFT', '链': 'SOL', '总分': 72, '等级': 'B', '建议': 'NFT交易所' },
  { '代币': 'CGPT', '项目名': 'ChainGPT', '赛道': 'AI', '链': 'BSC', '总分': 71, '等级': 'B', '建议': 'AI工具' },
  { '代币': 'ai16z', '项目名': 'ai16z', '赛道': 'AI Agent', '链': 'SOL', '总分': 70, '等级': 'B', '建议': 'AI概念' },
  { '代币': 'COOKIE', '项目名': 'Cookie', '赛道': 'AI', '链': 'Base', '总分': 70, '等级': 'B', '建议': 'AI数据' },
  { '代币': 'USUAL', '项目名': 'Usual', '赛道': 'Stablecoin', '链': 'ETH', '总分': 70, '等级': 'B', '建议': '稳定币新秀' },
  // B-级
  { '代币': 'ZEREBRO', '项目名': 'Zerebro', '赛道': 'AI', '链': 'SOL', '总分': 69, '等级': 'B-', '建议': 'AI Agent' },
  { '代币': 'GEAR', '项目名': 'Gearbox', '赛道': 'DeFi', '链': 'ETH', '总分': 69, '等级': 'B-', '建议': 'DeFi杠杆' },
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(ratings);
XLSX.utils.book_append_sheet(wb, ws, '币安Alpha评分');
const today = new Date().toISOString().slice(0,10).replace(/-/g,'-');
XLSX.writeFile(wb, `projects/binance-alpha/币安Alpha评分_${today}.xlsx`);
console.log(`Done - ${ratings.length} tokens saved`);
