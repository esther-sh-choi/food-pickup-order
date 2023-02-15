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
    return customer;
  })
  .then(res => {
    return customerQueries.addOrder(res.id);
  }) 
  .then(res => {
    return customerQueries.addFoodOrder(foodArray, res.id)
  })
  .then(res => {
    req.session.order_id = res[0].rows[0].order_id;
    return res.redirect("/customer/status");
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
