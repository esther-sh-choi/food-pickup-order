const express = require("express");
const router = express.Router();
const restaurantQueries = require("../db/queries/restaurants");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/orders", (req, res) => {
  const user = req.session.user;

  // Create getUserById and search restaurant table
  if (user) {
    res.render("orders", { owner: user });
  }
});

const login = function (username, password) {
  return restaurantQueries.getAdminWithUsername(username).then((user) => {
    if (password === user.password) {
      return user;
    }
    return null;
  });
};

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  login(username, password)
    .then((user) => {
      if (!user) {
        res.send({ error: "error" });
        return;
      }
      req.session.user = user;
      res.redirect("/restaurant/orders");
    })
    .catch((e) => res.send(e));
});

router.post("/logout", (req, res) => {
  req.session.user = null;
  res.render("index", { owner: null });
});

module.exports = router;
