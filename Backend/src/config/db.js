// import pkg from "pg";
// import dotenv from "dotenv";
// dotenv.config();

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test the connection
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL database"))
  .catch((err) => console.error("❌ Database connection error:", err));

// Helper function to get a client from the pool
const getClient = async () => {
  const client = await pool.connect();
  return client;
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient
};
