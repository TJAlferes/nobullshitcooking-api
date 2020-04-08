require('dotenv').config();
import AWS from 'aws-sdk';
import { Request, Response } from 'express';

import { S3Params } from './types';

const AWS_NOBSC_USER_AVATARS_S3_BUCKET: string =
process.env.AWS_NOBSC_USER_AVATARS_S3_BUCKET!;

export async function getSignedUrlAvatar(req: Request, res: Response) {
  const fileNameFullSize = `${req.session.userInfo.username}`;
  const fileNameTinySize = `${fileNameFullSize}-tiny`;
  const fileType = req.body.fileType;

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_NOBSC_USER_AVATARS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_NOBSC_USER_AVATARS_SECRET_ACCESS_KEY
  });

  const getSignedUrlPromise = (operation: string, params: S3Params) => {
    return new Promise((resolve, reject) => {
      s3.getSignedUrl(operation, params, (err, data) => {
        err ? reject(err) : resolve(data);
      });
    });
  };

  const signatureFullSize = await getSignedUrlPromise('putObject', {
    Bucket: AWS_NOBSC_USER_AVATARS_S3_BUCKET,
    Key: fileNameFullSize,
    ContentType: fileType,
    Expires: 50
  });

  const signatureTinySize = await getSignedUrlPromise('putObject', {
    Bucket: AWS_NOBSC_USER_AVATARS_S3_BUCKET,
    Key: fileNameTinySize,
    ContentType: fileType,
    Expires: 50
  });

  res.json({
    success: true,
    signedRequestFullSize: signatureFullSize,
    signedRequestTinySize: signatureTinySize,
    urlFullSize: fileNameFullSize
  });
};