const express = require("express");
// express async/await error handling support
require('express-async-errors');
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const dotenv = require("dotenv");
const routers = require("./router");
const connectDatabase = require("./helpers/database/connect-database");
const errorHandlerMiddleware = require("./middlewares/errors/errorHandler");

// Environment Variables
dotenv.config({ path: "./config/env/config.env" });

// MongoDb Connection
connectDatabase();

// Creating Server
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

// Security
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));
app.use(hpp());
app.use(cors());

// Routers Middleware
app.use(process.env.API_RELATIVE_URL, routers);

// Error Handler Middleware
app.use(errorHandlerMiddleware);

// Static Files Middleware
app.use(express.static("public"));

// Starting Server
app.listen(PORT, () => {
    console.log(`App Started on ${PORT} - Environment : ${process.env.NODE_ENV} `);
});