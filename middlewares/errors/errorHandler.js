const CustomError = require("../../helpers/error/CustomError");

const errorHandlerMiddleware = (err, req, res, next) => {

    let customError = new CustomError(err.message, err.status);

    if (err.name === "SyntaxError")
        customError = new CustomError("Unexpected Syntax", 400);

    if (err.name === "ValidationError")
        customError = new CustomError(err.message, 400);

    if (err.name === "CastError")
        customError = new CustomError("Please provide a valid input", 400);

    if (err.name === "MongoNetworkError")
        customError = new CustomError("There is a problem with network,Please try again later", 500);

    if (err.code === 11000) {
        const keyValue = err.hasOwnProperty("keyValue") ? JSON.stringify(err.keyValue).replace(/"/g, "'") : '';
        customError = new CustomError(`Duplicate Key Found : ${keyValue}`, 400);
    }

    return res.status(customError.status || 500).json({
        success: false,
        message: customError.message || "Internal Server Error"
    });
}

module.exports = errorHandlerMiddleware;
