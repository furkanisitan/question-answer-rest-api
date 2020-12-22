const jwt = require("jsonwebtoken");
const CustomError = require("../../helpers/error/CustomError");
const User = require("../../models/User");

const jwtAuth = async (req, res, next) => {

    if (!isTokenIncluded(req))
        return next(new CustomError("Unauthorized", 401));

    const token = getTokenFromHeader(req);

    // Control If Token Valid
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {

        if (err)
            return next(new CustomError("Unauthorized", 401));

        req.user = { id: decodedToken.id, name: decodedToken.name };
        return next();
    });
};

/**
 * NOTE JWTAuth must be run before this middleware. Otherwise req.user will be undefined.
 */
const adminAuth = async (req, res, next) => {

    // req.user.id => get from JWTAuth middleware
    const user = await User.findById(req.user.id);

    if (user.role !== "admin")
        return next(new CustomError("Only admins can access this route", 403));

    return next();
};

/**
 * NOTE JWTAuth must be run before this middleware. Otherwise req.user will be undefined.
 * @param {Model<Document>} model - model of the document to be checked
 * @param {string} idPathParam - name of id path parameter
 * @param {string} ownerFieldName - name of the field where the 'owner id' is store
 */
const ownerAuth = (model, idPathParam = "id", ownerFieldName = "owner") => {

    return async (req, res, next) => {

        const id = req.params[idPathParam];
        const doc = await model.findById(id).select(ownerFieldName);

        if (!doc[ownerFieldName].equals(req.user.id))
            return next(new CustomError("Only owner can handle this operation", 403));

        return next();
    }
};

module.exports = { jwtAuth, adminAuth, ownerAuth };

const getTokenFromHeader = (req) => {
    const authorization = req.headers.authorization;
    return authorization.split(" ")[1]; // without Bearer
}

const isTokenIncluded = (req) => {
    return req.headers.authorization && req.headers.authorization.startsWith("Bearer")
}