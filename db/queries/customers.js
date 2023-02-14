const db = require("../connection");

///// This query adds a new food order into the food_orders bridge table

const addFoodOrder = (food_orders) => {
  return db
  .query(`
    INSERT INTO food_orders (food_id, order_id)
    VALUES ($1, $2)
    RETURNING *;
  `, [food_orders.food_id, food_orders.order_id])
  .then((data) => {
    console.log(data);
    return data.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });
};


///// This query gets all the food item data from the foods table.

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


///// This query gets all the customers from the customers table.

const getAllCustomers = () => {
  return db
    .query(`SELECT * FROM customers;`)
    .then((data) => {
      console.log(data);
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};


// This query adds a new customer to the customers table.

const addCustomer = (customers) => {
  return db
  .query(`
    INSERT INTO customers (name, phone_number)
    VALUES ($1, $2)
    RETURNING *;
  `, [customers.name, customers.phone_number])
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
  addFoodOrder,
  getAllCustomers,
  addCustomer
};
