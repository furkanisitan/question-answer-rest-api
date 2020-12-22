const { User } = require("../models");

const adminController = {

    /**
     * get all users
     */
    allUsers: async (req, res, next) => {

        const users = await User.find();
        res.json({ success: true, data: users });
    },

    /**
     * get user by id
     */
    getUser: async (req, res, next) => {

        // req.doc => get from checkExistById middleware
        const user = req.doc;
        res.json({ success: true, data: user });
    },

    /**
     * update user by id
     */
    updateUser: async (req, res, next) => {

        const user = await User.findByIdAndUpdate(req.params.id, req.body);
        res.json({ success: true, message: "Update successful.", data: user });
    },

    /**
     * delete user by id
     */
    deleteUser: async (req, res, next) => {

        // req.doc => get from checkExistById middleware
        req.doc.remove();
        return res.json({ success: true, message: "User remove successful." });
    }

};

module.exports = adminController;
