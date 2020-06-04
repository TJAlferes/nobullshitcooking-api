'use strict';

//require('dotenv').config();
const AWS = require('aws-sdk');

export function emailUser(
  from: string,
  to: string,
  subject: string,
  body_text: string,
  body_html: string,
  charset: string
) {
  const ses = new AWS.SES();

  const params = { 
    Source: from, 
    Destination: { 
      ToAddresses: [
        to 
      ],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: charset
      },
      Body: {
        Text: {
          Data: body_text,
          Charset: charset 
        },
        Html: {
          Data: body_html,
          Charset: charset
        }
      }
    },
    //ConfigurationSetName: configuration_set
  };

  // fix types here
  ses.sendEmail(params, function(err: any, data: any) {
    if (err) console.log(err.message);
    else console.log("Email sent! Message ID: ", data.MessageId);
  });
}