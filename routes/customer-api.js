const express = require("express");
const router = express.Router();
const customerQueries = require("../db/queries/customers");
const twilio = require("../public/scripts/helpers/twilio");

/**
 * This route uses the getAllFoods query to get all foods data on the menu page.
 */
router.get("/menu", (req, res) => {
  customerQueries
    .getAllFoods()
    .then((foods) => {
      res.json(foods);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * This route uses the customerData and foodArray made during the checkout process to create a new customer and order.
 * It then sends an sms message to the restaurant confirming the new order.
 * Finally, the customer is redirected to the status page.
 */
router.post("/checkout", (req, res) => {
  const { customerData, foodIdArray } = req.body;
  if (
    !customerData[0] ||
    customerData[1]?.length < 12 ||
    !foodIdArray?.length
  ) {
    return res.status(401).json({ error: "Invalid input. Please try again." });
  }
  customerQueries
    .addCustomer(customerData)
    .then((customer) => {
      return customerQueries.addOrder(customer.id);
    })
    .then((order) => {
      const message = `You have recieved a new order from ${customerData[0]}! The order id is: ${order.id}. Check your orders page for more details.`;
      // twilio.smsMsgRestaurant(message).then((res) => console.log(res));
      return customerQueries.addFoodOrder(foodIdArray, order.id);
    })
    .then((foodOrder) => {
      req.session.order_id = foodOrder[0].order_id;
      res.redirect("/customer/status");
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * This route uses the getOrderById query to get the customers order information on the status page.
 */
router.get("/status", (req, res) => {
  const order_id = req.session.order_id;

  if (order_id) {
    customerQueries
      .getOrderById(order_id)
      .then((order) => {
        res.json(order);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } else {
    // change status code
    res.status(400).json({ error: "This is not your order." });
  }
});

module.exports = router;
