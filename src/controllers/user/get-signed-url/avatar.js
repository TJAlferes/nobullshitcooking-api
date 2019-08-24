require('dotenv').config();
//const uuidv4 = require('uuid/v4');  // do in React instead?
const AWS = require('aws-sdk');

/*AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_NOBSC_USER_AVATARS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_NOBSC_USER_AVATARS_SECRET_ACCESS_KEY
});*/

const AWS_NOBSC_USER_AVATARS_S3_BUCKET = process.env.AWS_NOBSC_USER_AVATARS_S3_BUCKET;

module.exports = async function(req, res) {
  const fileName = `${req.session.userInfo.username}`;
  const fileType = req.sanitize(req.body.fileType);
  console.log('avatar.type ', fileType);

  //const s3 = new AWS.S3();
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

  const signature = await getSignedUrlPromise('putObject', {
    Bucket: AWS_NOBSC_USER_AVATARS_S3_BUCKET,
    Key: fileName,
    ContentType: fileType,
    Expires: 50,
    //ACL: 'public-read'  // ?
  });
  /*const signature = await s3.getSignedUrl(
    'putObject',
    {
      Bucket: AWS_NOBSC_USER_AVATARS_S3_BUCKET,
      Key: fileName,
      ContentType: fileType,
      Expires: 50
    },
    (err, url) => res.send({
      success: true,
      signedRequest: signature,
      url: `https://${AWS_NOBSC_USER_AVATARS_S3_BUCKET}.s3.amazonaws.com/${fileName}`
    })
  );*/

  console.log('signature ', signature);

  res.json({
    success: true,
    signedRequest: signature,
    url: `https://${AWS_NOBSC_USER_AVATARS_S3_BUCKET}.s3.amazonaws.com/${fileName}${fileType}`
  });
};