const CustomError = require("../../helpers/error/CustomError");

/**
 * Check a document exist by id.
 * If the document exists, assign it to req.doc, otherwise throws an error.
 * @param {Model<Document>} model - model of the document to be checked
 * @param {string} idPathParam - name of id path parameter
 */
const checkExistById = (model, idPathParam = "id") => {

    return async (req, res, next) => {

        const id = req.params[idPathParam];
        const doc = await model.findById(id);

        if (!doc)
            return next(new CustomError(`${model.modelName} not found with ${idPathParam} : ${id}`, 404));

        req.doc = doc;
        return next();
    }
};

/**
 * Check exist child document by id in the parent document.
 * @param {Model<Document>} childModel - model of the child document to be checked
 * @param {string} childFieldName - name of the field where the child document id is store in the parent document
 * @param {string} childIdPathParam - name of child document id path parameter
 */
const checkExistInParent = (childModel, childFieldName, childIdPathParam = "id") => {

    return async (req, res, next) => {

        const parent = req.doc;
        await checkExistById(childModel, childIdPathParam)(req, res, function (err) {

            if (err) return next(err);

            const child = req.doc;
            if (!parent[childFieldName].includes(child._id))
                return next(new CustomError(`There is no ${childModel.modelName} with the '${child._id}' id of the ${parent.constructor.modelName} with id '${parent._id}'.`, 404));

            return next();
        });
    }
};


module.exports = { checkExistById, checkExistInParent };