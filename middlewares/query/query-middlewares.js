const { filterHelper, populateHelper, paginationHelper } = require("./helpers");
const options = require("./options");
const Question = require("../../models/Question");
const Answer = require("../../models/Answer");
const User = require("../../models/User");

const query = async function (model, options, req, find = {}) {

    // initial query
    let query = model.find(find);

    // select
    if (options.select)
        query = query.select(options.select);

    // search
    if (options.filterBy)
        query = filterHelper(query, { name: options.filterBy, value: req.query.search });

    // sort
    if (options.sortValues && req.query.sort)
        query = query.sort(options.sortValues[req.query.sort] ?? options.sortValues["default"])

    // populate
    if (options.populations && req.query.populate)
        query = populateHelper(query, options.populations, req.query.populate);

    // pagination
    let paginationResult = undefined
    if (options.pagination && (req.query.page || req.query.limit)) {
        const total = await model.countDocuments();
        options.pagination.page = getNumber(req.query.page, options.pagination.page);
        options.pagination.limit = getNumber(req.query.limit, options.pagination.limit);
        paginationResult = paginationHelper(query, options.pagination, total);
        query = paginationResult.query;
    }

    const queryResult = await query;
    return {
        count: queryResult.length,
        pagination: paginationResult?.pagination,
        data: queryResult,
    };

}

const questionQuery = async function (req, res, next) {
    res.queryResult = await query(Question, options.question, req);
    return next();
};

const userQuery = async function (req, res, next) {
    res.queryResult = await query(User, options.user, req);
    return next();
};

const answerQuery = async function (req, res, next) {
    res.queryResult = await query(Answer, options.answer, req, { question: req.params.qid });
    return next();
};


module.exports = { questionQuery, userQuery, answerQuery };

const getNumber = (number, defaultValue, min = 1) => {

    const num = parseInt(number);
    if (num >= min) return num
    return defaultValue;
}