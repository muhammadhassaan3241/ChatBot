const flash = require("connect-flash");
const { Token } = require("../middleware/verifyToken");
const { Room } = require("../model/room.model");
const { User } = require("../model/user.model");

const router = require("express").Router();

router.get("/sign-up", (req, res) => {
  res.render("signUp", { title: "Sign Up" });
});

router.get("/", (req, res) => {
  res.render("signIn", { title: "Sign In", message: flash('message') });
});

router.get("/chat", Token, async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  const users = await User.find();
  const rooms = await Room.find({ users: userId })
    .populate("users")
    .populate("messages");
  const discussions = [];

  // console.log(JSON.stringify(rooms));
  res.render("chat", {
    title: "ChatIO",
    user: user,
    users: users,
    myRooms: rooms,
    myID: userId,
  });
});

router.get("/forgot-password", (req, res) => {
  res.render("forgot-password");
});

router.get("/reset-password/:email", (req, res) => {
  res.render("reset-password");
});

module.exports = router;
