const express = require("express");
const router = express.Router();
const restaurantQueries = require("../db/queries/restaurants");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const smsMessage = (name, message, phone_number, photo_url) => {
  return new Promise((res, err) => {
    client.messages
      .create({
        body: `Hello, ${name}! ${message}`,
        from: "+15205237081",
        mediaUrl: [photo_url],
        to: `+1${phone_number}`,
      })
      .then((message) => res(message.sid))
      .catch((err) => {
        console.log(err);
      });
  });
};

router.get("/orders", (req, res) => {
  const user = req.session.user;

  if (user) {
    restaurantQueries
      .getAllOrders()
      .then((orders) => {
        res.json(orders);
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  }
});

router.post("/orders/:order_id/confirm", (req, res) => {
  const order_id = req.params.order_id;
  const user = req.session.user;
  const { preptime, customerName, phoneNumber } = req.body;

  if (user) {
    restaurantQueries
      .updateEstimatedTime(order_id, preptime)
      .then((order) => {
        const message = `We are preparing your order! Please pick up in ${preptime} minutes.`;
        const photo_url =
          "https://images-ext-1.discordapp.net/external/cU3k6BlDpujtHPW-Yk-cJYdC0kydqJeW5_Q4LCvrW6Q/https/torontolife.com/wp-content/uploads/2021/01/KRISS_FINAL04.jpg?width=999&height=666";

        console.log(customerName, phoneNumber);
        // smsMessage(customerName, message, phoneNumber, photo_url).then((res) =>
        //   console.log(res)
        // );
        res.json(order);
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  }
});

router.post("/orders/:order_id/update", (req, res) => {
  const order_id = req.params.order_id;
  const user = req.session.user;
  const {
    isComplete = false,
    type,
    isCancelled = false,
    preptime = 0,
    phoneNumber,
    customerName,
  } = req.body;

  const receivedData = {
    isComplete,
    type,
    isCancelled,
    preptime,
    ...req.body,
  };

  if (user) {
    restaurantQueries
      .updateOrder(order_id, receivedData)
      .then((order) => {
        const messages = {
          cancel:
            "We are very sorry to inform you that your order has been cancelled. Please contact the restaurant for further details.",
          ready: "Your order is ready for pickup! See you soon :)",
          complete:
            "Thank you for choose Aloette! Hope you see you again soon.",
          edit: `We are very sorry. Your order needs extra ${preptime} minutes to prepare. Thank you for your patience.`,
        };
        const photo_url =
          "https://images-ext-1.discordapp.net/external/cU3k6BlDpujtHPW-Yk-cJYdC0kydqJeW5_Q4LCvrW6Q/https/torontolife.com/wp-content/uploads/2021/01/KRISS_FINAL04.jpg?width=999&height=666";
        console.log(customerName, phoneNumber);
        // smsMessage(customerName, messages[type], phoneNumber, photo_url).then(
        //   (res) => {
        //     console.log(res);
        //   }
        // );

        res.json(order);
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  }
});

module.exports = router;
