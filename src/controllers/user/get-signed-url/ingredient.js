require('dotenv').config();
const uuidv4 = require('uuid/v4');  // do in React instead?
const AWS = require('aws-sdk');

const AWS_NOBSC_USER_INGREDIENTS_S3_BUCKET = process.env.AWS_NOBSC_USER_INGREDIENTS_S3_BUCKET;

module.exports = async function(req, res) {
  const fileName = `${req.session.userInfo.username}-${uuidv4()}`;
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

  const signature = await getSignedUrlPromise('putObject', {
    Bucket: AWS_NOBSC_USER_INGREDIENTS_S3_BUCKET,
    Key: fileName,
    Expires: 50,
    ContentType: fileType,
    ACL: 'public-read'  // ?
  });

  res.json({
    success: true,
    signedRequest: signature,
    url: `https://${AWS_NOBSC_USER_INGREDIENTS_S3_BUCKET}.s3.amazonaws.com/${fileName}`
  });
};