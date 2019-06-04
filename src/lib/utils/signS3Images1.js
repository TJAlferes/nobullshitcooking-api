require('dotenv').config();
const uuidv4 = require('uuid/v4');
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const AWS_S3_BUCKET_IMAGES_1 = process.env.AWS_S3_BUCKET_IMAGES_1;

module.exports = function(req, res) {
  const fileName = `${uuidv4()}${req.body.fileName}`;
  const fileType = req.body.fileType;
  const s3 = new AWS.S3();
  const s3Params = {
    Bucket: AWS_S3_BUCKET_IMAGES_1,
    Key: fileName,
    Expires: 50,
    ContentType: fileType,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) return res.json({success: false, error: err});
    res.json({
      success: true,
      data: {
        signedRequest: data,
        url: `https://${AWS_S3_BUCKET_IMAGES_1}.s3.amazonaws.com/${fileName}`
      }
    })
  });
};
