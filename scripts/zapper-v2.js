const https = require('https');

const API_KEY = '864e1fc6-3b0d-42d9-945c-a484b27a7806';
const wallet = process.argv[2] || '0x2CF36c2a6d04faE0E80A92b5d4BB73fE4e2e4f72';

const query = `query PortfolioV2($addresses: [Address!]!) {
  portfolioV2(addresses: $addresses) {
    tokenBalances {
      totalBalanceUSD
      byToken(first: 5) {
        edges {
          node {
            symbol
            balance
            balanceUSD
            network { name }
          }
        }
      }
    }
  }
}`;

const data = JSON.stringify({ 
  query, 
  variables: { addresses: [wallet] }
});

const options = {
  hostname: 'public.zapper.xyz',
  path: '/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-zapper-api-key': API_KEY
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
