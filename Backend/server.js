// import app from "./src/app.js";
// import dotenv from "dotenv";
// dotenv.config();

const app = require("./src/app.js");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});