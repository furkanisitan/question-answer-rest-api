const router = require("express").Router();
const userRoute = require("./routes/user");
const accountRoute = require("./routes/account");
const adminRoute = require("./routes/admin");
const questionRoute = require("./routes/question");

router.use("/users", userRoute);
router.use("/account", accountRoute);
router.use("/admin", adminRoute);
router.use("/questions", questionRoute);

module.exports = router;