const db = require("../connection");


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
  addFoodOrder,
  getStarterFoods
};
