require('dotenv').config();
import S3 from 'aws-sdk/clients/s3';
import { Request, Response } from 'express';

import { getSignedUrlPromise } from '../../../lib/utils/getSignedUrlPromise';

const AWS_NOBSC_USER_AVATARS_S3_BUCKET: string =
process.env.AWS_NOBSC_USER_AVATARS_S3_BUCKET!;

export async function getSignedUrlAvatar(req: Request, res: Response) {
  const fileNameFullSize = `${req.session!.userInfo.username}`;
  const fileNameTinySize = `${fileNameFullSize}-tiny`;
  const fileType = req.body.fileType;

  const s3 = new S3({
    accessKeyId: process.env.AWS_NOBSC_USER_AVATARS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_NOBSC_USER_AVATARS_SECRET_ACCESS_KEY
  });

  const signatureFullSize = await getSignedUrlPromise(s3, 'putObject', {
    Bucket: AWS_NOBSC_USER_AVATARS_S3_BUCKET,
    Key: fileNameFullSize,
    ContentType: fileType,
    Expires: 50
  });

  const signatureTinySize = await getSignedUrlPromise(s3, 'putObject', {
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