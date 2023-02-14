const express = require("express");
const router = express.Router();
const customerQueries = require('../db/queries/customers');

// Customer Queries

router.get('/menu', (req, res) => {
  customerQueries.getAllFoods()
    .then(foods => {
      res.json(foods);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.get("/checkout", (req, res) => {
  // const userId = req.session.userId;
  const userId = true;
  // let phone = req.body.phone_input
  // let name = req.body.name_input
  if (userId) {
    customerQueries.addFoodOrder(1, 2)
    .then(foods => {
      res.json({ foods });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  }
});


module.exports = router;
