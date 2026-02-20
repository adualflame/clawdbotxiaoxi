const XLSX = require('xlsx');

const evaluations = [
  { '日期': '2026-02-20', '代币': 'Aliens', '链': 'BSC', '合约': '0x3bc4162e09d943b390c54281ad78e277aaf74444', '合约安全': 20, '流动性': 23, '持仓分布': 8, '项目信息': 5, '总分': 56, '等级': 'C', '风险提示': 'Top1持仓82%，仅17地址' },
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(evaluations);
XLSX.utils.book_append_sheet(wb, ws, '代币评估');
XLSX.writeFile(wb, 'reports/代币评估记录.xlsx');
console.log(`Done - ${evaluations.length} evaluations`);
