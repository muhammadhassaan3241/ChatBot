import flash from "connect-flash";
import { Router } from "express";
import { Token } from "../middleware/verifyToken.js";
import { User } from "../model/user.model.js";
import { Notification } from "../model/notification.model.js"
import { date, formatAMPM, saveTheday } from "../config/time.js";
import { Message } from "../model/message.model.js";
import path from "path";
import mongoose from "mongoose";
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
  var contacts = [];
  const discussions = [];
  const notifications = [];
  const userId = req.user.id;
  const user = await User.findById(userId);
  const message = await Message.find({ friend: userId }).populate('users')
  message.filter((r) => {
    discussions.push({
      roomId: r.roomId,
      senderId: r.friend,
      sender: r.friend.map((u) => { return `${u.firstName} ${u.lastName}` }),
      senderImage: r.friend.map((u) => { return u.image }),
      messages: r.messages,
      time: formatAMPM(r.createdAt),
      day: saveTheday(r.createdAt),
      date: date(r.createdAt)
    })
  })

  // ========================================== GETTING ALL CONTACTS EXCEPT YOURS
  const users = await User.find();
  const index = users.findIndex((m) => {
    return m.id === userId
  })
  if (index !== -1) users.splice(index, 1)
  users.filter((u) => {
    contacts.push({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      image: u.image,
      location: u.location,
    })
  });

  // const notify = await Notification.find();
  // notify.filter((n) => {
  //   if (JSON.stringify(n.receiver) === JSON.stringify(req.user.id)) {
  //     notifications.push({
  //       message: n.friendRequest,
  //       time: formatAMPM(n.createdAt),
  //       date: date(n.createdAt),
  //       day: saveTheday(n.createdAt),
  //       sender: n.sender,
  //       receiver: n.receiver,
  //       room: n.roomId,
  //       socket: n.socket,
  //     })
  //   }
  // })

  res.render("chat", {
    title: "ChatIO",
    user: user,
    users: users,
    myID: userId,
    contacts: contacts,
    discussions: discussions,
    // notifications: notifications,
  });
});
// ============================================================================================== CHAT
pagesRoutes.get('/friend-profile/:id', Token, async (req, res) => {

  const send = await User.findById(req.user.id);
  const receive = await User.findById(req.params.id);
  const sender = await User.findById(send);
  const user = await User.findById(receive);
  const friend = [];
  friend.push({
    sender: {
      id: send.id,
      name: `${send.firstName} ${send.lastName}`,
      image: send.image,
      location: send.location,
    },
    receiver: {
      id: receive.id,
      name: `${receive.firstName} ${receive.lastName}`,
      image: receive.image,
      location: receive.location,
    }
  })
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
