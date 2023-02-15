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


router.post("/checkout", (req, res) => {
  const { customerData, foodArray } = req.body;
  if (!customerData[0] || !customerData[1] || !foodArray?.length) {
    return res
      .status(401)
      .render("menu", { errorMessage: "You cannot submit empty fields.", owner: false });
  }
  customerQueries.addCustomer(customerData)
  .then(customer => {
    return customerQueries.addOrder(customer.id);
  })
  .then(order => {
    return customerQueries.addFoodOrder(foodArray, order.id)
  })
  .then(foodOrder => {
    req.session.order_id = foodOrder[0].order_id;
    res.redirect("/customer/status");
  })
  .catch(err => {
    console.log(err);
    res
      .status(500)
      .json({ error: err.message });
  });
});


router.get('/status', (req, res) => {
  customerQueries.addCustomer()
    .then(foods => {
      res.json(foods);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});


module.exports = router;
