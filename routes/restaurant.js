const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/orders", (req, res) => {
  res.render("orders", { owner: true });
});

module.exports = router;
