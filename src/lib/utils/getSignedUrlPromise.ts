import S3 from 'aws-sdk/clients/s3';

export function getSignedUrlPromise(s3: S3, operation: string, params: S3Params) {
  return new Promise((resolve, reject) => {
    s3.getSignedUrl(operation, params, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
}

interface S3Params {
  Bucket: string;
  Key: string;
  ContentType: string;
  Expires: number;
}