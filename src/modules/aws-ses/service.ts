import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export async function emailUser({ from, to, subject, bodyText, bodyHtml, charset}: EmailUserParams) {
  if (process.env.NODE_ENV === 'test') return;  // TO DO: aws-sdk-client-mock

  const sesClient = new SESClient({
    credentials: {
      accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!
    },
    region: 'us-east-1'
  });

  const params = {
    Source: from ?? 'noreply@nobullshitcooking.com',
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
    }
  };
  
  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    console.log('Email sent! Data: ', data);
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
