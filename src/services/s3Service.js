const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-1",
});

async function uploadFileToS3(fileStream, key) {
  const s3Upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: fileStream,
    },
    queueSize: 4,
    partSize: 1024 * 1024 * 5,
    leavePartsOnError: false,
  });

  const { Location } = await s3Upload.done();
  return Location;
}

module.exports = uploadFileToS3;
