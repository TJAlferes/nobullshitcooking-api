require('dotenv').config();
const uuidv4 = require('uuid/v4');  // do in React instead?
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const AWS_S3_BUCKET_IMAGES_1 = process.env.AWS_S3_BUCKET_IMAGES_1;

module.exports = async function(req, res, next) {
  try {
    const fileName = `${uuidv4()}${req.body.fileName}`;  // do in React instead?
    const fileType = req.body.fileType;
    const s3 = new AWS.S3();
    const getSignedUrlPromise = (operation, params) => {
      return new Promise((resolve, reject) => {
        s3.getSignedUrl(operation, params, (err, data) => {
          err ? reject(err) : resolve(data);
        });
      });
    };
    const signature = await getSignedUrlPromise('putObject', {
      Bucket: AWS_S3_BUCKET_IMAGES_1,
      Key: fileName,
      Expires: 50,
      ContentType: fileType,
      ACL: 'public-read'
    });
    res.json({
      success: true,
      data: {
        signedRequest: signature,
        url: `https://${AWS_S3_BUCKET_IMAGES_1}.s3.amazonaws.com/${fileName}`
      }
    });
    next();
  } catch(err) {
    next(err);
  }
};
