const db = require('../connection');

const getAllOrders = () => {
  return db.query('SELECT * FROM orders ORDER BY created_at;')
    .then(data => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};


module.exports = { getAllOrders };






