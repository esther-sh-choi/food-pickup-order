const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

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

const smsMsgRestaurant = (message) => {
  return new Promise((res, err) => {
    client.messages
      .create({
        body: `${message}`,
        from: "+15205237081",
        to: "+14169869028",
      })
      .then((message) => res(message.sid))
      .catch((err) => {
        console.log(err);
      });
  });
};

module.exports = { smsMsgCustomer, smsMsgRestaurant };
