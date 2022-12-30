require('dotenv').config();
import { S3Client } from '@aws-sdk/client-s3';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { getSignedUrlPromise } from '../../lib/utils';

const AWS_S3_CONTENT_BUCKET: string = process.env.AWS_S3_CONTENT_BUCKET!;

export const getSignedUrl = {
  content: async function(req: Request, res: Response) {
    const fullName =  `${req.session.staffInfo!.staffname}-${uuidv4()}`;
    const thumbName = `${fullName}-thumb`;
    const fileType =  req.body.fileType;
  
    const s3 = new S3Client({accessKeyId: process.env.AWS_S3_CONTENT_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_S3_CONTENT_SECRET_ACCESS_KEY});
  
    const fullSignature =  await getSignedUrlPromise(s3, 'putObject', {Bucket: AWS_S3_CONTENT_BUCKET, Key: fullName, ContentType: fileType, Expires: 50});
    const thumbSignature = await getSignedUrlPromise(s3, 'putObject', {Bucket: AWS_S3_CONTENT_BUCKET, Key: thumbName, ContentType: fileType, Expires: 50});
  
    return res.json({success: true, fullSignature, thumbSignature, fullName});
  }
};