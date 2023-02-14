const express = require("express");
const router = express.Router();
const restaurantQueries = require("../db/queries/restaurants");

router.get("/orders", async (req, res) => {
  const templateVar = { orders: [] };
  const userId = req.session.userId;

  if (userId) {
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

router.post("/orders/:order_id/update", (req, res) => {
  const order_id = req.params.order_id;
  const userId = req.session.userId;
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

  if (userId) {
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

const login = function (username, password) {
  return restaurantQueries.getAdminWithUsername(username).then((user) => {
    if (password === user.password) {
      console.log(user);
      return user;
    }
    return null;
  });
};

router.post("/login", (req, res) => {
  // const { username, password } = req.body;
  login("admin", "admin")
    .then((user) => {
      if (!user) {
        res.send({ error: "error" });
        return;
      }
      req.session.userId = user.id;
      res.render("orders", { owner: user });
    })
    .catch((e) => res.send(e));
});

router.post("/logout", (req, res) => {
  req.session.userId = null;
  res.render("index", { owner: null });
});

module.exports = router;
