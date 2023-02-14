const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/orders", (req, res) => {
  const userId = req.session.userId;

  // Create getUserById and search restaurant table
  if (userId) {
    res.render("orders", { owner: true });
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
    })
    .catch((e) => res.send(e));
});

router.post("/logout", (req, res) => {
  req.session.userId = null;
  res.render("index", { owner: null });
});

module.exports = router;
