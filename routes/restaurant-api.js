const express = require("express");
const router = express.Router();
const restaurantQueries = require("../db/queries/restaurants");
const twilio = require('../public/scripts/helpers/twilio');


router.get("/orders", (req, res) => {
  const user = req.session.user;

  if (user) {
    restaurantQueries
      .getAllOrders()
      .then((orders) => {
        res.json(orders);
      })
      .catch((e) => {
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
        const message = `We are preparing your order! Please plan to pickup in ${preptime} minutes.`;
        const photo_url =
          "https://images-ext-1.discordapp.net/external/cU3k6BlDpujtHPW-Yk-cJYdC0kydqJeW5_Q4LCvrW6Q/https/torontolife.com/wp-content/uploads/2021/01/KRISS_FINAL04.jpg?width=999&height=666";

        // twilio.smsMsgCustomer(customerName, message, phoneNumber, photo_url).then((res) =>
        //   console.log(res)
        // );
        res.json(order);
      })
      .catch((e) => {
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
            "Sadly we need to cancel your order. Please try again, or call us with your Order ID for further details.",
          ready: "Your order is ready for pick up! See you soon :)",
          complete:
            "Thank you for choosing Aloette! We hope to serve you again soon.",
          edit: `Your order needs an extra ${preptime} minutes to prepare. Our apologies for the delay, thank you for your patience.`,
        };
        // twilio.smsMsgCustomer(customerName, messages[type], phoneNumber).then(
        //   (res) => {
        //     console.log(res);
        //   }
        // );

        res.json(order);
      })
      .catch((e) => {
        res.send(e);
      });
  }
});

module.exports = router;
