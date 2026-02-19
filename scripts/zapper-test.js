const https = require('https');

const API_KEY = '864e1fc6-3b0d-42d9-945c-a484b27a7806';
const auth = Buffer.from(API_KEY + ':').toString('base64');

const query = `{
  tokenPrice(address: "0x0000000000000000000000000000000000000000", network: ETHEREUM_MAINNET) {
    price
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
  res.on('end', () => console.log(body));
});

req.write(data);
req.end();
