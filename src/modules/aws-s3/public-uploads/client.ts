import { S3Client } from '@aws-sdk/client-s3';

export const AwsS3PublicUploadsClient = new S3Client({
  credentials: {
    accessKeyId:     process.env.AWS_S3_PUBLIC_UPLOADS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_PUBLIC_UPLOADS_SECRET_ACCESS_KEY!
  }, 
  region: "us-east-1"
});
