require('dotenv').config();
const Replicate = require('replicate');
const fs = require('fs');
const https = require('https');
const path = require('path');

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function generateImage(prompt, outputName = 'output.png') {
  console.log('🎨 生成中...');
  console.log(`📝 提示词: ${prompt}\n`);

  const output = await replicate.run(
    "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    {
      input: {
        prompt: prompt,
        width: 1024,
        height: 1024,
        num_outputs: 1
      }
    }
  );

  const imageUrl = output[0];
  console.log('✅ 生成成功!');
  console.log(`🔗 URL: ${imageUrl}`);

  // 下载图片
  const outputPath = path.join(__dirname, 'outputs', outputName);
  await downloadImage(imageUrl, outputPath);
  console.log(`💾 已保存: ${outputPath}`);
  
  return outputPath;
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

// 主函数
const prompt = process.argv[2] || 'cute AI girl avatar, short hair, soft smile, cyberpunk style, glowing eyes, minimalist background, pastel colors, anime style';
const filename = process.argv[3] || 'avatar.png';

generateImage(prompt, filename).catch(console.error);
