const { tweet } = require('./index');

const text = process.argv[2];

if (!text) {
  console.log('用法: node tweet.js "推文内容"');
  process.exit(1);
}

tweet(text).catch(() => process.exit(1));
