const pickOmit = require("object.pickomit").setDefaultPicks('_id');
const CustomError = require("../helpers/error/CustomError");
const { getBool } = require("../helpers/my-helpers");
const { ownerPermission } = require("../helpers/authorization/field-access-keys");
const { Question } = require("../models");

const questionController = {

    /**
     * get all questions
     */
    all: async (req, res, next) => {

        // res.queryResult => from questionQuery middleware
        res.json({ success: true, ...res.queryResult });
    },

    /**
     * get question by id
     */
    get: async (req, res, next) => {

        // req.doc => get from checkExistById middleware
        res.json({ success: true, data: req.doc });
    },

    /**
     * add question
     */
    add: async (req, res, next) => {

        const body = pickOmit.select(req.body, ownerPermission.Question.create);

        // req.user => get from jwtAuth middleware
        const question = await Question.create({ ...body, owner: req.user.id });
        res.json({ success: true, message: "Question adding successful.", data: question });
    },

    /**
     * update question by id
     */
    update: async (req, res, next) => {

        const body = pickOmit.select(req.body, ownerPermission.Question.update);
        const question = await Question.findByIdAndUpdate(req.params.id, body);
        res.json({ success: true, message: "Question update successful.", data: question });
    },

    /**
     * delete question by id
     */
    delete: async (req, res, next) => {

        // req.doc => get from checkExistById middleware
        req.doc.remove();
        return res.json({ success: true, message: "Question remove successful." });
    },

    /**
     * like - undo like question
     */
    patch: async (req, res, next) => {

        const like = getBool(req.query.like)
        if (like === undefined) return next(new CustomError("Invalid query parameters.", 400));

        // req.doc => get from checkExistById middleware
        // req.user => get from jwtAuth middleware
        await req.doc.like(like, req.doc, req.user.id);
        return res.json({ success: true, message: `Question ${like ? 'like' : 'undo like'} successful.` });
    }
};

module.exports = questionController;
