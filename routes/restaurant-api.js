const express = require("express");
const router = express.Router();
const restaurantQueries = require("../db/queries/restaurants");

router.get("/orders", async (req, res) => {
  const templateVar = { orders: [] };
  const user = req.session.user;

  if (user) {
    try {
      const orders = await restaurantQueries.getAllOrders();

      for (const order of orders) {
        const foodData = await restaurantQueries.getAllOrderFoods(
          order.order_id
        );
        templateVar.orders.push({
          ...order,
          foods: foodData,
        });
      }

      res.send(templateVar.orders);
    } catch (e) {
      console.error(e);
      res.send(e);
    }
    return;
  }
});

router.post("/orders/:order_id/confirm", (req, res) => {
  const order_id = req.params.order_id;
  const user = req.session.user;
  const { preparation_time } = req.body;

  if (user) {
    restaurantQueries
      .updateEstimatedTime(order_id, preparation_time)
      .then((order) => {
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
    isReady = false,
    isCancelled = false,
    preparation_time = 0,
  } = req.body;

  const receivedData = {
    isComplete,
    isReady,
    isCancelled,
    preparation_time,
    ...req.body,
  };

  if (user) {
    restaurantQueries
      .updateOrder(order_id, receivedData)
      .then((order) => {
        res.json(order);
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  }
});

module.exports = router;
