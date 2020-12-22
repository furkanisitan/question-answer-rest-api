const router = require("express").Router();
const adminController = require("../controllers/admin");
const { jwtAuth, adminAuth } = require("../middlewares/authorization/auth");
const { checkExistById } = require("../middlewares/database/entityExist");
const { User } = require("../models");

router.use(jwtAuth, adminAuth);

router.get("/users", adminController.allUsers)
router.get("/users/:id", checkExistById(User), adminController.getUser)
router.patch("/users/:id", checkExistById(User), adminController.updateUser)
router.delete("/users/:id", checkExistById(User), adminController.deleteUser)

module.exports = router;
