import flash from "connect-flash";
import { Router } from "express";
import { Token } from "../middleware/verifyToken.js";
import { User } from "../model/user.model.js";
import { Notification } from "../model/notification.model.js"
import { date, formatAMPM, saveTheday } from "../config/time.js";
import { Message } from "../model/message.model.js";
import path from "path";
import mongoose from "mongoose";
import { escape, unescape } from "querystring";
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
  const contacts = [];
  const friends = [];
  const discussions = [];
  const notifications = [];
  const userId = req.user.id;
  const users = await User.find();
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
  const fri = user.friends;
  fri.filter(async (f) => {
    const friend = await User.find(f);
    friend.filter((f) => {
      friends.push({
        id: f.id,
        name: `${f.firstName} ${f.lastName}`,
        image: unescape(f.image),
        location: f.location,
        email: f.email,
        username: f.username,
      })
    })
  })
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

  const notify = await Notification.find();
  notify.filter((n) => {
    if (JSON.stringify(n.receiver) === JSON.stringify(req.user.id)) {
      notifications.push({
        message: n.friendRequest,
        time: formatAMPM(n.createdAt),
        date: date(n.createdAt),
        day: saveTheday(n.createdAt),
        sender: n.sender,
        receiver: n.receiver,
        socket: n.socket,
        accept: n.accept,
        reject: n.reject,
      })
    }
  })
  const accept = notifications.map((s) => { return s.accept });
  const reject = notifications.map((s) => { return s.reject });
  res.render("chat", {
    title: "ChatIO",
    user: user,
    users: users,
    myID: userId,
    contacts: contacts,
    discussions: discussions,
    notifications: notifications,
    accept: accept,
    reject: reject,
    friends: friends,
  });
});
// ============================================================================================== 
// ============================================================================================== CHAT
pagesRoutes.get('/friend-profile/:id', Token, async (req, res) => {
  const notifications = [];
  const notifications2 = [];
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
  const notify = await Notification.find();
  notify.filter((n) => {
    if (JSON.stringify(n.receiver) === JSON.stringify(req.user.id)) {
      notifications.push({
        message: n.friendRequest,
        time: formatAMPM(n.createdAt),
        date: date(n.createdAt),
        day: saveTheday(n.createdAt),
        sender: n.sender,
        receiver: n.receiver,
        socket: n.socket,
        sent: n.sent,
      })
    }
    if (JSON.stringify(n.sender) === JSON.stringify(req.user.id)) {
      notifications2.push({
        message: n.friendRequest,
        time: formatAMPM(n.createdAt),
        date: date(n.createdAt),
        day: saveTheday(n.createdAt),
        sender: n.sender,
        receiver: n.receiver,
        socket: n.socket,
        sent: n.sent,
      })
    }
  })
  const sent1 = notifications.map((s) => { return s.sent });
  const sent2 = notifications2.map((s) => { return s.sent });

  function sent() {
    if (sent1) {
      console.log({ sent1 });
      return sent1
    }
    else if (sent2) {
      console.log({ sent2 });
      return sent2
    }
  }
  sent()

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
