// mergeParams: true => preserve the req.params values from the parent router.
const router = require("express").Router({ mergeParams: true });
const answerController = require("../controllers/answer");
const { jwtAuth, ownerAuth } = require("../middlewares/authorization/auth");
const { checkExistInParent } = require("../middlewares/database/entityExist");
const { answerQuery } = require("../middlewares/query/query-middlewares");
const { Answer } = require("../models");

router.get("/", answerQuery, answerController.all);
router.post("/", jwtAuth, answerController.add);
router.get("/:id", checkExistInParent(Answer, "answers"), answerController.get);
router.put("/:id", jwtAuth, checkExistInParent(Answer, "answers"), ownerAuth(Answer), answerController.update);
router.patch("/:id", jwtAuth, checkExistInParent(Answer, "answers"), answerController.patch);
router.delete("/:id", jwtAuth, checkExistInParent(Answer, "answers"), ownerAuth(Answer), answerController.delete);

module.exports = router;
