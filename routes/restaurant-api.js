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

router.post("/preptime", (req, res) => {
  const userId = req.session.userId;
  if (userId) {
    restaurantQueries
      .editPreptime(1, 60 * 60 * 1000)
      .then((order) => {
        res.json(order);
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  }
});

router.post("/countdown", (req, res) => {
  const userId = req.session.userId;
  const order_id = req.body.order_id;
  if (userId) {
    restaurantQueries
      .countdownPreptime(order_id)
      .then((order) => {
        res.json(order);
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  }
});

router.get("/cancel", (req, res) => {
  // const userId = req.session.userId;
  const userId = true;
  if (userId) {
    restaurantQueries
      .cancelOrder(1)
      .then((order) => {
        res.json({ order });
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  }
});

router.get("/ready", (req, res) => {
  // const userId = req.session.userId;
  const userId = true;
  if (userId) {
    restaurantQueries
      .readyOrder(1)
      .then((order) => {
        res.json({ order });
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  }
});

router.get("/complete", (req, res) => {
  // const userId = req.session.userId;
  const userId = true;
  if (userId) {
    restaurantQueries
      .completeOrder(1)
      .then((order) => {
        res.json({ order });
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
