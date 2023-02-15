const express = require("express");
const router = express.Router();
const restaurantQueries = require("../db/queries/restaurants");

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
  const { preptime } = req.body;
  console.log(preptime);

  if (user) {
    restaurantQueries
      .updateEstimatedTime(order_id, preptime)
      .then((order) => {
        console.log(order);
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
        console.log(order);
        res.json(order);
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  }
});

module.exports = router;
