// const express = require("express");
// const router = express.Router();
const { Client } = require("pg");

const client = new Client({
  user: "kl_db2023",
  host: "localhost",
  database: "disabled2023",
  password: "dis2023!",
  port: 5432,
});


module.exports = {client,};