require('dotenv').config();
const AWS = require('aws-sdk');

const AWS_NOBSC_USER_AVATARS_S3_BUCKET = process.env.AWS_NOBSC_USER_AVATARS_S3_BUCKET;

module.exports = async function(req, res) {
  const fileNameFullSize = `${req.session.userInfo.username}`;
  const fileNameTinySize = `${fileNameFullSize}-tiny`;
  const fileType = req.sanitize(req.body.fileType);

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_NOBSC_USER_AVATARS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_NOBSC_USER_AVATARS_SECRET_ACCESS_KEY
  });

  const getSignedUrlPromise = (operation, params) => {
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