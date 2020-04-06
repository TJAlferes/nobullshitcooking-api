require('dotenv').config();
const uuidv4 = require('uuid/v4');  // do in React instead?
const AWS = require('aws-sdk');
import { Request, Response } from 'express';

const AWS_NOBSC_USER_INGREDIENTS_S3_BUCKET = process.env.AWS_NOBSC_USER_INGREDIENTS_S3_BUCKET;

module.exports = async function(req: Request, res: Response) {
  const fileNameFullSize = `${req.session.userInfo.username}-${uuidv4()}`;
  const fileNameTinySize = `${fileNameFullSize}-tiny`;
  const fileType = req.sanitize(req.body.fileType);

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_NOBSC_USER_INGREDIENTS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_NOBSC_USER_INGREDIENTS_SECRET_ACCESS_KEY
  });

  const getSignedUrlPromise = (operation, params) => {
    return new Promise((resolve, reject) => {
      s3.getSignedUrl(operation, params, (err, data) => {
        err ? reject(err) : resolve(data);
      });
    });
  };

  const signatureFullSize = await getSignedUrlPromise('putObject', {
    Bucket: AWS_NOBSC_USER_INGREDIENTS_S3_BUCKET,
    Key: fileNameFullSize,
    ContentType: fileType,
    Expires: 50
  });

  const signatureTinySize = await getSignedUrlPromise('putObject', {
    Bucket: AWS_NOBSC_USER_INGREDIENTS_S3_BUCKET,
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