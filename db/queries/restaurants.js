const db = require("../connection");

const getAllOrders = () => {
  const queryString = `
  SELECT
  orders.id as order_id,
  customers.id as customer_id,
  foods.id as food_id,
  COUNT(foods.*) as food_quantity,
  orders.*,
  customers.*,
  foods.*
  FROM orders
  JOIN customers ON customers.id = orders.customer_id
  JOIN food_orders ON food_orders.order_id = orders.id
  JOIN foods ON food_orders.food_id = foods.id
  GROUP BY foods.id, orders.id, customers.id
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

const updateEstimatedTime = (order_id, preparation_time) => {
  return db
    .query(
      `UPDATE orders
  SET estimated_ready_at = NOW() + interval '${preparation_time} minutes'
  WHERE orders.id = $1
  RETURNING *;`,
      [order_id]
    )
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const updateOrder = (order_id, data) => {
  const { preptime, isComplete, type, isCancelled } = data;

  if (type === "ready") {
    ready_at = "NOW()";
  }

  return db
    .query(
      `UPDATE orders
  SET estimated_ready_at = estimated_ready_at + interval '${preptime} minutes',
  is_complete = $2,
  ready_at = ${type === "ready" ? "NOW()" : "ready_at"},
  is_cancelled = $3
  WHERE orders.id = $1
  RETURNING *;`,
      [order_id, isComplete, isCancelled]
    )
    .then((data) => {
      return data.rows;
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
  updateOrder,
  updateEstimatedTime,
  getAdminWithUsername,
};
