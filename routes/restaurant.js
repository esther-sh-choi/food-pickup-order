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

module.exports = router;
