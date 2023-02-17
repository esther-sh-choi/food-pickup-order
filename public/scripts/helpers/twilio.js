const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

/*
Creates a message using the Twilio client and then sends it to the customers phone_number.
*/

const smsMsgCustomer = (name, message, phone_number, photo_url) => {
  return new Promise((res, err) => {
    client.messages
      .create({
        body: `Hello, ${name}! ${message}`,
        from: "+15205237081",
        mediaUrl: [photo_url],
        to: `${phone_number}`,
      })
      .then((message) => res(message.sid))
      .catch((err) => {
        console.log(err);
      });
  });
};

/*
Creates a message using the Twilio client and then sends it to the restauranst phone_number.
*/

const smsMsgRestaurant = (message) => {
  return new Promise((res, err) => {
    client.messages
      .create({
        body: `${message}`,
        from: "+15205237081",
        //**** Put your number below to receive SMS as the restaurant when customer places an order. ****//
        to: "+14167295604",
      })
      .then((message) => res(message.sid))
      .catch((err) => {
        console.log(err);
      });
  });
};

module.exports = { smsMsgCustomer, smsMsgRestaurant };
