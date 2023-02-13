const db = require("../connection");

const getAllOrders = () => {
  const queryString = `
  SELECT orders.id as order_id, orders.preparation_time, customers.phone_number
  FROM orders
  JOIN customers ON customers.id = orders.customer_id
  JOIN food_orders ON food_orders.order_id = orders.id
  GROUP BY orders.id, customers.phone_number
  ORDER BY created_at;`;

  return db
    .query(queryString)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getAllOrderFoods = (order_id) => {
  const queryString = `
  SELECT foods.name, count(food_orders.*) as food_count
  FROM food_orders
  JOIN foods ON food_orders.food_id = foods.id
  WHERE order_id = $1
  GROUP BY food_id, order_id, foods.name;
  `;

  return db
    .query(queryString, [order_id])
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const editPreptime = (order_id, preptime) => {
  return db
    .query(
      `UPDATE orders
  SET preparation_time = $2
  WHERE orders.id = $1
  RETURNING *;`,
      [order_id, preptime]
    )
    .then((data) => {
      console.log(data);
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const cancelOrder = (order_id) => {
  return db
    .query(
      `UPDATE orders
  SET isCancelled = TRUE
  WHERE orders.id = $1
  RETURNING *;`,
      [order_id]
    )
    .then((data) => {
      console.log(data);
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const readyOrder = (order_id) => {
  return db
    .query(
      `UPDATE orders
  SET ready_at = NOW()
  WHERE orders.id = $1
  RETURNING *;`,
      [order_id]
    )
    .then((data) => {
      console.log(data);
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const completeOrder = (order_id) => {
  return db
    .query(
      `UPDATE orders
  SET isComplete = TRUE
  WHERE orders.id = $1
  RETURNING *;`,
      [order_id]
    )
    .then((data) => {
      console.log(data);
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getAdminWithUsername = (username) => {
  return db
    .query(`SELECT * FROM restaurants WHERE username = $1`, [username])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = {
  getAllOrders,
  getAllOrderFoods,
  editPreptime,
  cancelOrder,
  readyOrder,
  completeOrder,
  getAdminWithUsername,
};
