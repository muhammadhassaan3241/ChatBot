import flash from "connect-flash";
import { Router } from "express";
import { Token } from "../middleware/verifyToken.js";
import { User } from "../model/user.model.js";
import { Notification } from "../model/notification.model.js"
import { date, formatAMPM, saveTheday } from "../config/time.js";
import { Message } from "../model/message.model.js";
import { getContacts, getFriends, getNotifications, getRooms } from "../middleware/getMiddlewareFunctions.middleware.js";
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
pagesRoutes.get("/chat", Token, getNotifications, getFriends, getContacts, getRooms, async (req, res) => {


  const userId = req.user.id;
  const users = await User.find();
  const user = await User.findById(userId);
  

  res.render("chat", {
    title: "ChatIO",
    user: user,
    users: users,
    myID: userId,
    contacts: req.contacts,
    notifications: req.notifications,
    accept: req.accept,
    reject: req.reject,
    friends: req.friends,
    discussions: req.roomDetails,
  });

})
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



