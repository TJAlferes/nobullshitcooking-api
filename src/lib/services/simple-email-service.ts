'use strict';

//require('dotenv').config();
import SES from 'aws-sdk/clients/ses';

export function emailUser(
  from: string,
  to: string,
  subject: string,
  body_text: string,
  body_html: string,
  charset: string
) {
  const ses = new SES();

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
  
  ses.sendEmail(params, function(err, data) {
    if (err) console.log(err.message);
    else console.log("Email sent! Message ID: ", data.MessageId);
  });
}