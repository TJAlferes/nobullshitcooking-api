require('dotenv').config();
const uuidv4 = require('uuid/v4');  // do in React instead?
const AWS = require('aws-sdk');

const AWS_NOBSC_USER_INGREDIENTS_S3_BUCKET = process.env.AWS_NOBSC_USER_INGREDIENTS_S3_BUCKET;

module.exports = async function(req, res) {
  const fileNameFullSize = `${req.session.userInfo.username}-${uuidv4()}`;
  const fileNameThumbSize = `${fileNameFullSize}-thumb`;
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

  const signatureThumbSize = await getSignedUrlPromise('putObject', {
    Bucket: AWS_NOBSC_USER_INGREDIENTS_S3_BUCKET,
    Key: fileNameThumbSize,
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
    signedRequestThumbSize: signatureThumbSize,
    signedRequestTinySize: signatureTinySize,
    urlFullSize: fileNameFullSize
  });
};