const db = require("../connection");


/**
 * User Story: 1
 *
 * As a customer, I want to see all the available items on the menu because I want to select menu items that I want to eat.
 *
 * Query (c): Select all the items  from the foods table.
 * Then we render the data to the menu cards. → return array of data → ('api/customer/menu' : GET)
 */


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

module.exports = { getAllFoods };
