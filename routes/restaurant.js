const express = require("express");
const router = express.Router();
const restaurantQueries = require("../db/queries/restaurants");

router.get("/orders", (req, res) => {
  const user = req.session.user;

  // Create getUserById and search restaurant table
  if (user) {
    res.render("orders", { owner: user, status: false });
  }
});

router.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/restaurant/orders");
  }

  console.log("here");

  res.render("login", { errorMessage: "" });
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

  if (!username || !password || (!username && !password)) {
    return res
      .status(400)
      .render("login", { errorMessage: "You cannot submit empty fields." });
  }

  login(username, password)
    .then((user) => {
      if (!user) {
        return res.status(403).render("login", {
          errorMessage: "This username/password does not exist.",
        });
      }
      req.session.user = user;
      res.redirect("/restaurant/orders");
    })
    .catch((e) => res.send(e));
});

router.post("/logout", (req, res) => {
  req.session.user = null;
  res.redirect("/");
});

module.exports = router;
