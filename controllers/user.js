const bcrypt = require("bcrypt");
const pickOmit = require("object.pickomit").setDefaultPicks('_id');
const CustomError = require("../helpers/error/CustomError");
const { isNotEmpty } = require("../helpers/my-helpers");
const { ownerPermission, publicPermission } = require("../helpers/authorization/field-access-keys");
const { User } = require("../models");

const userController = {

    signup: async (req, res, next) => {

        const body = pickOmit.select(req.body, ownerPermission.User.create);
        const user = await User.create(body);
        sendAccessTokenToClient(user, res, "Signup successful.", 201);
    },

    login: async (req, res, next) => {

        const { email, password } = req.body;

        if (!isNotEmpty(email, password))
            return next(new CustomError("Please enter all parameters.", 400));

        const user = await User.findOne({ email }).select("+password");

        if (!user || !bcrypt.compareSync(password, user.password))
            return next(new CustomError("Incorrect email or password.", 401));

        sendAccessTokenToClient(user, res, "Login successful.");
    },

    logout: async (req, res, next) => {

        res.clearCookie(process.env.COOKIE_NAME_ACCESS_TOKEN)
            .json({ success: true, message: "Logout successful." });
    },

    /**
     * get all users
     */
    all: async (req, res, next) => {

        // res.queryResult => from userQuery middleware
        res.json({ success: true, ...res.queryResult });
    },

    /**
     * get user by id
     */
    get: async (req, res, next) => {

        // req.doc => get from checkExistById middleware
        const user = pickOmit.select(req.doc.toObject(), publicPermission.User.read);
        res.json({ success: true, data: user });
    },
};

module.exports = userController;

const sendAccessTokenToClient = (user, res, message, statusCode = 200) => {

    const token = user.generateAccessToken();
    const { JWT_COOKIE_EXPIRE, NODE_ENV } = process.env;

    return res
        .status(statusCode)
        .cookie(process.env.COOKIE_NAME_ACCESS_TOKEN, token, {
            httpOnly: true,
            maxAge: parseInt(JWT_COOKIE_EXPIRE) * 1000 * 60,
            secure: NODE_ENV !== "development"
        })
        .json({
            success: true,
            token,
            message,
            data: pickOmit.select(user.toObject(), ownerPermission.User.read)
        });
}