import flash from "connect-flash";
import { Router } from "express";
import { Token } from "../middleware/verifyToken.js";
import { User } from "../model/user.model.js";
import { Room } from "../model/room.model.js"
const pagesRoutes = Router();
// ================================================== IMPORTS MODULES AND PACKAGES


// URL's
// ============================================================================================== ROUTES
pagesRoutes.get("/sign-up", (req, res) => {
  res.render("signUp", { title: "Sign Up" });
});
// ============================================================================================== SIGN UP
pagesRoutes.get("/", (req, res) => {
  res.render("signIn", { title: "Sign In", message: flash('message') });
});
// ============================================================================================== SIGN IN
pagesRoutes.get("/chat", Token, async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  const users = await User.find();
  const rooms = await Room.find({ users: userId })
    .populate("users")
  const friends = [];
  const discussions = [];
  rooms.filter((r) => {
    discussions.push({
      name: `${r.users.firstName} ${r.users.lastName}`,
      messages: r.messages.find((m) => { return m.content }),
    })
  });
  users.filter((u) => {
    friends.push({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      image: u.image,
    })
  })
  console.log(JSON.stringify(rooms));
  res.render("chat", {
    title: "ChatIO",
    user: user,
    users: users,
    friends: friends,
    myRooms: rooms,
    myID: userId,
  });
});
// ============================================================================================== CHAT
pagesRoutes.get('/add-friend/:id', Token, async (req, res) => {

  const sender = await User.findById(req.user.id);
  const receiver = await User.findById(req.params.id);
  const friend = [{
    name: `${receiver.firstName} ${receiver.lastName}`,
    sender: sender.id,
    receiver: receiver.id,
    senderName: sender.firstName,
    receiverName: receiver.firstName,
    receiverImage: receiver.image,
    senderImage: sender.image,
  }];
  res.render('friendProfile', { title: "Profile", friend: friend });

})
// ============================================================================================== ADD FRIEND
pagesRoutes.get("/forgot-password", (req, res) => {
  res.render("forgot-password");
});
// ============================================================================================== FORGOT PASSWORD
pagesRoutes.get("/reset-password/:email", (req, res) => {
  res.render("reset-password");
});
// ============================================================================================== RESET PASSWORD

export default pagesRoutes;  //============================== EXPORTING MODULE
