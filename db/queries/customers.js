const db = require("../connection");


/**
 * User Story: 3
 *
 * As a customer, I want to click on the Checkout button to send a request to the server that I want to purchase those items.
 *
 * Send data to db (c): send the food_id and the count to the database. INSERT to food_orders table.  → ('api/customer/checkout' POST)
 *
 */


const addFoodOrder = () => {
  return db
  .query(`INSERT`)
  .then((data) => {
    console.log(data);
    return data.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });
};



const getAllFoods = () => {
  return db
    .query(`SELECT * FROM foods;`)
    .then((data) => {
      console.log(data);
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = {
  getAllFoods,
  addFoodOrder
};
