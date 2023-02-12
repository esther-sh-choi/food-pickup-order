const db = require("../connection");

const getAllOrders = () => {
  return db
    .query("SELECT * FROM orders ORDER BY created_at;")
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

const getadminWithUsername = (username) => {
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
  editPreptime,
  cancelOrder,
  readyOrder,
  completeOrder,
  getadminWithUsername
};
