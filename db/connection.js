// PG database client/connection setup
const { Pool } = require("pg");

/* Comment dbParams below to run in your own database */
const dbParams = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

/* Uncomment dbParams below to run in your own database and localhost */
// const dbParams = {
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// };

const db = new Pool(dbParams);

db.connect();

module.exports = db;
