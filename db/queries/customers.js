const db = require("../connection");

///// This query adds a new food order into the food_orders bridge table

// const addFoodOrder = (foodArray, order_id) => {
//   const promises = foodArray.map((id) => {
//     return db.query(
//       `INSERT INTO food_orders (food_id, order_id)
//        VALUES ($1, $2)
//        RETURNING *;
//       `,
//       [id, order_id]
//     );
//   });
//   return Promise.all(promises).then(() => {
//     return order_id;
//   });
// };

const addFoodOrder = (foodArray, order_id) => {
  const promises = foodArray.map((id) => {
    return db.query(
      `INSERT INTO food_orders (food_id, order_id)
       VALUES ($1, $2)
       RETURNING *;
      `,
      [id, order_id]
    );
  });
  return Promise.all(promises);
};

///// This query gets all the food item data from the foods table.

const getAllFoods = () => {
  return db
    .query(`SELECT * FROM foods;`)
    .then((data) => {
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
  `, [customers[0], customers[1]])
  .then((data) => {
    return data.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
  });
};


// This query adds a new customer order.

const addOrder = (customer_id) => {
  return db
  .query(`
    INSERT INTO orders (customer_id, created_at)
    VALUES ($1, NOW())
    RETURNING *;
  `, [customer_id])
  .then((data) => {
    return data.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
  });
}

module.exports = {
  getAllFoods,
  addFoodOrder,
  getAllCustomers,
  addCustomer,
  addOrder
};
