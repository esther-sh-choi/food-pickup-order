const express = require("express");

const router = express.Router();
const restaurantQueries = require("../db/queries/restaurants");
const twilio = require("../public/scripts/helpers/twilio");
// const socketServer = require("../socketServer");

/*
If the user is logged on this route will query the database for all the orders and return them as JSON
*/

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

const createRouter = (socketServer) => {
  /*
This route will update the estimated time for an order with the given order ID, based on the preptime value in the request body.
After updating the database, it will send an SMS message to the customer using the Twilio helper function and then return the updated order information as JSON.
*/

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

          // twilio
          //   .smsMsgCustomer(customerName, message, phoneNumber, photo_url)
          //   .then((res) => console.log(res));

          res.json(order);
        })
        .catch((e) => {
          res.send(e);
        });
    }
  });

  /*
This route is a POST request to update an order with a given order_id.
If a user is present, the restaurantQueries.updateOrder function is called with order_id and receivedData annd updates the order in the database.
Once the order has been successfully updated, the appropriate message is sent to the customer via Twilio.
*/

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

    socketServer.to(order_id).emit("hello", { string: "world", num: 8 });

    // socketServer.on("connection", (socket) => {
    //   console.log("connected");
    //   socket.join(order_id);
    // });

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
          // twilio
          //   .smsMsgCustomer(customerName, messages[type], phoneNumber)
          //   .then((res) => {
          //     console.log(res);
          //   });
          // const socket = req.app.get("io");
          // console.log("io is: ", socket);
          // console.log("order id is ", order_id);
          // socket.to(order_id).emit("hello", {
          //   string: "order update",
          //   num: 8,
          // });
          res.json(order);
        })
        .catch((e) => {
          res.send(e);
        });
    }
  });

  return router;
};

module.exports = createRouter;
