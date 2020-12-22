const router = require("express").Router();
const questionController = require("../controllers/question");
const answerRoute = require("./answer");
const { jwtAuth, ownerAuth } = require("../middlewares/authorization/auth");
const { checkExistById } = require("../middlewares/database/entityExist");
const { questionQuery } = require("../middlewares/query/query-middlewares");
const { Question } = require("../models");


router.get("/", questionQuery, questionController.all);
router.post("/", jwtAuth, questionController.add);
router.get("/:id", checkExistById(Question), questionController.get);
router.put("/:id", jwtAuth, checkExistById(Question), ownerAuth(Question), questionController.update);
router.patch("/:id", jwtAuth, checkExistById(Question), questionController.patch);
router.delete("/:id", jwtAuth, checkExistById(Question), ownerAuth(Question), questionController.delete);

router.use("/:qid/answers", checkExistById(Question, "qid"), answerRoute);

module.exports = router;