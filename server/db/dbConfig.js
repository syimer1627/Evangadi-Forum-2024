
require('dotenv').config();

const mysql2 = require("mysql2");

const dbConnection = mysql2.createPool({
  user: process.env.DB_USER,          // Use environment variables
  database: process.env.DB_NAME,      // Use environment variables
  host: process.env.DB_HOST,          // Use environment variables
  password: process.env.DB_PASSWORD,  // Use environment variables
  connectionLimit: 10,
});

module.exports = dbConnection.promise();
