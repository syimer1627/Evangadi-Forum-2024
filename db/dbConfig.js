const mysql2 = require("mysql2");
const fs = require("fs");

const dbconnection = mysql2.createPool({
  port: 3306,
  user: process.env.USER,
  database: process.env.DATABASE,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  connectionLimit: 10,
});

module.exports = dbconnection.promise();
