const { publicPermission } = require("../../helpers/authorization/field-access-keys");

const options = {
    question: {
        select: publicPermission.Question.readAll,
        filterBy: "title",
        sortValues: {
            "most-answered": "-answerCount -title",
            "most-liked": "-likeCount -title",
            "default": "-createdAt"
        },
        populations: [
            { path: "owner", select: publicPermission.User.readAll },
            { path: "answers", select: publicPermission.Answer.readAll }
        ],
        pagination: { page: 1, limit: 5 }
    },

    user: {
        select: publicPermission.User.readAll,
        filterBy: "name",
        pagination: { page: 1, limit: 5 }
    },

    answer: {
        select: publicPermission.Answer.readAll,
        filterBy: "content",
        sortValues: {
            "most-liked": "-likeCount -content",
            "default": "-createdAt"
        },
        populations: [
            { path: "owner", select: publicPermission.User.read },
            { path: "question", select: publicPermission.Answer.readOne }
        ],
        pagination: { page: 1, limit: 5 }
    }
};

module.exports = options;
