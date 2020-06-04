require('dotenv').config();
import { v4 as uuidv4 } from 'uuid';  // do in React instead?
import S3 from 'aws-sdk/clients/s3';
import { Request, Response } from 'express';

import { S3Params } from './types';

const AWS_NOBSC_USER_RECIPE_S3_BUCKET: string =
process.env.AWS_NOBSC_USER_RECIPE_S3_BUCKET!;

export async function getSignedUrlRecipe(req: Request, res: Response) {
  const fileNameFullSize = `${req.session!.userInfo.username}-${uuidv4()}`;
  const fileNameThumbSize = `${fileNameFullSize}-thumb`;
  const fileNameTinySize = `${fileNameFullSize}-tiny`;
  const fileType = req.body.fileType;

  const s3 = new S3({
    accessKeyId: process.env.AWS_NOBSC_USER_RECIPE_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_NOBSC_USER_RECIPE_SECRET_ACCESS_KEY
  });

  const getSignedUrlPromise = (operation: string, params: S3Params) => {
    return new Promise((resolve, reject) => {
      s3.getSignedUrl(operation, params, (err, data) => {
        err ? reject(err) : resolve(data);
      });
    });
  };

  const signatureFullSize = await getSignedUrlPromise('putObject', {
    Bucket: AWS_NOBSC_USER_RECIPE_S3_BUCKET,
    Key: fileNameFullSize,
    ContentType: fileType,
    Expires: 50
  });

  const signatureThumbSize = await getSignedUrlPromise('putObject', {
    Bucket: AWS_NOBSC_USER_RECIPE_S3_BUCKET,
    Key: fileNameThumbSize,
    ContentType: fileType,
    Expires: 50
  });

  const signatureTinySize = await getSignedUrlPromise('putObject', {
    Bucket: AWS_NOBSC_USER_RECIPE_S3_BUCKET,
    Key: fileNameTinySize,
    ContentType: fileType,
    Expires: 50
  });

  res.json({
    success: true,
    signedRequestFullSize: signatureFullSize,
    signedRequestThumbSize: signatureThumbSize,
    signedRequestTinySize: signatureTinySize,
    urlFullSize: fileNameFullSize
  });
};