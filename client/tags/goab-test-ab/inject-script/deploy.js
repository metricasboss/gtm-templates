require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: false,
  endpoint: `https://s3.${process.env.AWS_REGION}.amazonaws.com`,
});

async function uploadToS3() {
  const filePath = path.join(__dirname, 'dist', 'goab-init-bundle.js');
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: 'goab-init-bundle.js',
    Body: fileContent,
    ContentType: 'application/javascript',
    CacheControl: 'public, max-age=31536000',
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    console.log('✅ Deploy successful!');
    console.log(`📦 File uploaded to: https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/goab-init-bundle.js`);
  } catch (error) {
    console.error('❌ Deploy failed:', error);
    process.exit(1);
  }
}

uploadToS3();
