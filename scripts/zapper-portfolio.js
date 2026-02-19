const https = require('https');

const API_KEY = '864e1fc6-3b0d-42d9-945c-a484b27a7806';
const auth = Buffer.from(API_KEY + ':').toString('base64');

// 查询钱包资产
const wallet = process.argv[2] || '0x2CF36c2a6d04faE0E80A92b5d4BB73fE4e2e4f72';

const query = `{
  portfolio(addresses: ["${wallet}"]) {
    tokenBalances {
      token {
        symbol
        name
      }
      balance
      balanceUSD
    }
  }
}`;

const data = JSON.stringify({ query });

const options = {
  hostname: 'public.zapper.xyz',
  path: '/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${auth}`
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const result = JSON.parse(body);
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      console.log(body);
    }
  });
});

req.write(data);
req.end();
