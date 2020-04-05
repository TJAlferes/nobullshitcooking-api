/*
// we're not using this yet (if ever)

'use strict';

const { google } = require('googleapis');



// setup

google.options({auth: createConnection});  // needed?

const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirect: process.env.GOOGLE_REDIRECT_URL
};

const defaultScopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email'
];



// helpers

function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: defaultScopes
  });
}

function getGooglePlusApi(auth) {
  return google.plus({version: 'v1', auth});
}



// Step 1:
// Create a Google URL and send to the client to log in the user

function createGoogleUrl() {
  const auth = createConnection();
  const url = getConnectionUrl(auth);
  return url;
}



// Step 2:
// Take the "code" parameter which Google gives us once when the user logs in,
// then get the user's email and id

function getGoogleAccountFromCode(code) {
  const data = await auth.getToken(code);
  const tokens = data.tokens;

  const auth = createConnection();
  auth.setCredentials(tokens);

  const plus = getGooglePlusApi(auth);
  const me = await plus.people.get({userId: 'me'});
  const userGoogleId = me.data.id;

  const userGoogleEmail = (
    me.data.emails &&
    me.data.emails.length &&
    me.data.emails[0].value
  );
  
  return {tokens: tokens, id: userGoogleId, email: userGoogleEmail};
}
*/