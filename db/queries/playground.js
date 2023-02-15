const getAllOrders = () => {
  const queryString = `
  SELECT orders.id as order_id, orders.estimated_ready_at, customers.phone_number,
  orders.is_complete, orders.ready_at, orders.is_cancelled, orders.customer_id
  FROM orders
  JOIN customers ON customers.id = orders.customer_id
  JOIN food_orders ON food_orders.order_id = orders.id
  GROUP BY orders.id, customers.phone_number
  ORDER BY created_at;`;

  return db
    .query(queryString)
    .then((data) => {
      console.log(data.rows);
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
  WHERE order_id IN $1
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
