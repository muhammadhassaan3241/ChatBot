import flash from "connect-flash";
import { Router } from "express";
import { Token } from "../middleware/verifyToken.js";
import { User } from "../model/user.model.js";
import { Notification } from "../model/notification.model.js"
import { date, formatAMPM, saveTheday } from "../config/time.js";
import { Message } from "../model/message.model.js";
import path from "path";
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
  const friends = [];
  const discussions = [];
  const notifications = [];
  const userId = req.user.id;
  const users = await User.find();
  const user = await User.findById(userId);
  const notification = await Notification.find({ friend: userId }).populate('users');
  const message = await Message.find({ friend: userId }).populate('users')
  message.filter((r) => {
    discussions.push({
      roomId: r.roomId,
      sender: r.friend.map((u) => { return `${u.firstName} ${u.lastName}` }),
      senderImage: r.friend.map((u) => { return u.image }),
      messages: r.messages,
      time: formatAMPM(r.createdAt),
      day: saveTheday(r.createdAt),
      date: date(r.createdAt)
    })
  })

  users.filter((u) => {
    friends.push({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      image: u.image,
    })
  });

  notification.filter((n) => {
    notifications.push({
      sender: n.users.map((nu) => { return `${nu.firstName} ${nu.lastName}` }),
      senderImage: n.friendRequest.map((ni) => { return ni.senderImage }),
      message: n.users.map((nu) => { return `${nu.firstName} ${nu.lastName} sent you a friend request` }),
      time: formatAMPM(n.createdAt),
      day: saveTheday(n.createdAt),
      date: date(n.createdAt),
    })
  })

  console.log({ discussions });
  res.render("chat", {
    title: "ChatIO",
    user: user,
    users: users,
    friends: friends,
    discussions: discussions,
    myID: userId,
    notifications: notifications,
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
    receiverEmail: receiver.email,
    senderEmail: sender.email,
  }];

  // console.log(friend);
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
