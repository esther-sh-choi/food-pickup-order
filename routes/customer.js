const express = require("express");
const router = express.Router();

router.get("/menu", (req, res) => {
  res.render("menu", { owner: false, status: false });
});

router.get("/status", (req, res) => {
  const order_id = req.session.order_id;
  if (order_id) {
    const templateVar = { owner: false, status: true, order_id: order_id };
    res.render("status", templateVar);
  }
});

module.exports = router;
