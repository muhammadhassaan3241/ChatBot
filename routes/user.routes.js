const { signUp, signIn, signOut } = require("../controllers/user.controller");
const router = require("express").Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/sign-out", signOut)

module.exports = router;
