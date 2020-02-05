const emailUser = require('./services/simple-email-service');

const emailConfirmationCode = email => {
  const from = "No Bullshit Cooking <staff@nobullshitcooking.com>";

  const to = email;

  const subject = "Confirmation Code For No Bullshit Cooking";

  const bodyText = "Confirmation Code For No Bullshit Cooking\r\n" +
  "Please enter the following confirmation code at:\r\n" +
  "https://nobullshitcooking.com/user/verify\r\n" +
  confirmationCode;

  const bodyHtml = `
    <html>
    <head></head>
    <body>
      <h1>Confirmation Code For No Bullshit Cooking</h1>
      <p>Please enter the following confirmation code at:</p>
      <p>https://nobullshitcooking.com/user/verify</p>
      ${confirmationCode}
    </body>
    </html>
  `;

  const charset = "UTF-8";

  emailUser(from, to, subject, bodyText, bodyHtml, charset);
};

module.exports = emailConfirmationCode;