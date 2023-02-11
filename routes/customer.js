const express = require("express");
const router = express.Router();

router.get("/menu", (req, res) => {
  res.render("menu");
});

router.get("/status", (req, res) => {
  res.render("status");
});

module.exports = router;
