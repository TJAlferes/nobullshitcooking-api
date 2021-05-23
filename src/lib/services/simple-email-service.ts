'use strict';

//require('dotenv').config();
import { SESClient, CloneReceiptRuleSetCommand } from '@aws-sdk/client-ses';

export async function emailUser(
  from: string,
  to: string,
  subject: string,
  body_text: string,
  body_html: string,
  charset: string
) {
  const client = new SESClient({});

  const params = { 
    Source: from, 
    Destination: { 
      ToAddresses: [to]
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
    RuleSetName: undefined,
    OriginalRuleSetName: undefined
    //ConfigurationSetName: configuration_set
  };
  const command = new CloneReceiptRuleSetCommand(params);
  
  try {
    const data = await client.send(command);
    console.log("Email sent! Data: ", data);
  } catch (error) {
    console.log(error.message);
  } finally {}
}