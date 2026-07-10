require("dotenv").config();

const app = require("./app");

console.log("Loading app...");

const connectDB = require("./config/db");

console.log("Connecting Mongo...");

connectDB();

console.log("Starting server...");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});