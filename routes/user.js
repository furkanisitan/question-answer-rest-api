const router = require("express").Router();
const userController = require("../controllers/user");
const { jwtAuth } = require("../middlewares/authorization/auth");
const { checkExistById } = require("../middlewares/database/entityExist");
const { userQuery } = require("../middlewares/query/query-middlewares");
const { User } = require("../models");


router.get("/", userQuery, userController.all);
router.get("/:id", checkExistById(User), userController.get);
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/logout", jwtAuth, userController.logout);

module.exports = router;

