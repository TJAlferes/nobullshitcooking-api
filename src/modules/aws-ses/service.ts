import { SESClient, CloneReceiptRuleSetCommand } from '@aws-sdk/client-ses';

export async function emailUser({ from, to, subject, bodyText, bodyHtml, charset}: EmailUserParams) {
  if (process.env.NODE_ENV === 'test') return;  // TO DO: aws-sdk-client-mock

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
          Data: bodyText,
          Charset: charset 
        },
        Html: {
          Data: bodyHtml,
          Charset: charset
        }
      }
    },
    RuleSetName: undefined,
    OriginalRuleSetName: undefined
  };
  
  const command = new CloneReceiptRuleSetCommand(params);
  
  try {
    const data = await client.send(command);
    console.log("Email sent! Data: ", data);
  } catch (error: any) {
    console.log(error.message);
  } finally {}
}

type EmailUserParams = {
  from:     string;
  to:       string;
  subject:  string;
  bodyText: string;
  bodyHtml: string;
  charset:  string;
}
