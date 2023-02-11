const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/orders", (req, res) => {
  res.render("orders");
});

module.exports = router;
