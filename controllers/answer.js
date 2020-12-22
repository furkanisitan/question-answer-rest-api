const pickOmit = require("object.pickomit").setDefaultPicks('_id');
const CustomError = require("../helpers/error/CustomError");
const { getBool } = require("../helpers/my-helpers");
const { ownerPermission, publicPermission } = require("../helpers/authorization/field-access-keys");
const { Answer } = require("../models");

const answerController = {

    /**
     * get all answers of the question
     */
    all: async (req, res, next) => {

        // res.queryResult => from questionQuery middleware
        res.json({ success: true, ...res.queryResult });
    },

    /**
     * get answer of the question by answer id
     */
    get: async (req, res, next) => {

        const answer = await Answer.findById(req.doc._id).populate("owner").populate("question");
        res.json({ success: true, data: answer });
    },

    /**
     * add answer to question
     */
    add: async (req, res, next) => {

        const questionId = req.params.qid;
        const body = pickOmit.select(req.body, ownerPermission.Answer.create);

        // req.user => get from jwtAuth middleware
        const answer = await Answer.create({ ...body, owner: req.user.id, question: questionId });
        res.json({ success: true, message: "Answer adding successful.", data: answer });
    },

    /**
     * update answer of question
     */
    update: async (req, res, next) => {

        const body = pickOmit.select(req.body, ownerPermission.Answer.update)
        const answer = await Answer.findByIdAndUpdate(req.params.id, body);
        res.json({ success: true, message: "Answer update successful.", data: answer });
    },

    /**
     * delete answer
     */
    delete: async (req, res, next) => {

        // req.doc => get from checkExistById middleware
        req.doc.remove();
        return res.json({ success: true, message: "Answer remove successful." });
    },

    /**
     * like - undo like answer
     */
    patch: async (req, res, next) => {

        const like = getBool(req.query.like)
        if (like === undefined) return next(new CustomError("Invalid query parameters.", 400));

        // req.doc => get from checkExistById middleware
        // req.user => get from jwtAuth middleware
        await req.doc.like(like, req.doc, req.user.id);
        return res.json({ success: true, message: `Answer ${like ? 'like' : 'undo like'} successful.` });
    }

};

module.exports = answerController;
