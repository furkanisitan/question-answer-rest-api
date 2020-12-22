const router = require("express").Router();
const accountController = require("../controllers/account");
const { jwtAuth } = require("../middlewares/authorization/auth");
const { photoUpload } = require("../helpers/libraries/storage");

// not starts with '/recovery'
router.use(/^(?!\/recovery).+/, jwtAuth);

router.get("/", accountController.get);
router.patch("/", accountController.update);
router.put("/profile-image", photoUpload.single('profile-image'), accountController.uploadImage);
router.get("/recovery", accountController.recoveryGet);
router.post("/recovery", accountController.recovery);
router.put("/recovery", accountController.resetPassword);
router.get("/questions", accountController.getAllQuestions);
router.get("/answers", accountController.getAllAnswers);

module.exports = router;
