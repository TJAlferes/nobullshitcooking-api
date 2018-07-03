const stripePackage = require('stripe');
const { calculateCost } = require('../libs/billing-lib');
const { success, failure } = require('../libs/response-lib');

// this is an AWS Lambda -- change to an Express response
// move this to an Express route in the routes directory
export async function main(event, context, callback) {
  const { storage, source } = JSON.parse(event.body);

  const amount = calculateCost(storage);

  const description = 'Scratch charge';

  const stripe = stripePackage(process.env.stripeSecretKey);

  try {
    await stripe.charges.create({
      source,
      amount,
      description,
      currency: 'usd'
    });
    callback(null, success({status: true}));
  } catch (err) {
    callback(null, failure({message: err.message}));
  }
}