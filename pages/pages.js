import flash from "connect-flash";
import { Router } from "express";
import { Token } from "../middleware/verifyToken.js";
import { User } from "../model/user.model.js";
import { Notification } from "../model/notification.model.js"
import { date, formatAMPM, saveTheday } from "../config/time.js";
import { Message } from "../model/message.model.js";
import path, { resolve } from "path";
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
  const notifications = [];
  const userId = req.user.id;
  const users = await User.find();
  const user = await User.findById(userId);

  const room = await Message.find(
    {
      $or: [
        { "room": { $elemMatch: { "users": { $elemMatch: { "user1": userId } } } } },
        { "room": { $elemMatch: { "users": { $elemMatch: { "user2": userId } } } } }
      ]
    });







  // // ROOMS INTEGRATION START
  // const roomDetails = [];
  // const roomMessages = [];
  // room.filter(async (r) => {
  //   // returning friend id except yours =========================
  //   function findFriend(callback) {
  //     if (JSON.stringify(r.sender) !== JSON.stringify(userId)) {
  //       return r.sender;
  //     } else {
  //       return r.receiver;
  //     }
  //   }
  //   // ===========================================================
  //   // saving messages
  //   r.message.filter((m) => {
  //     roomMessages.push({
  //       message: m.content,
  //       day: saveTheday(m.createdAt),
  //     })
  //   })
  //   roomDetails.push({
  //     roomId: r.room.map((r) => { return r.roomId }),
  //     myId: userId,
  //     day: saveTheday(r.createdAt),
  //     friend: findFriend(),
  //     message: roomMessages[roomMessages.length - 1],
  //     messageCount: roomMessages.length,
  //   })
  // })


  getData(room, userId).then(async (data) => {

    var roomUsers = [];
    getRoomUsers(data?.roomDetails).then((data) => {
      console.log({ data });
      roomUsers = data
    })


    console.log({ roomUsers });


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

    // console.log(JSON.stringify(roomsDetails));

    res.render("chat", {
      title: "ChatIO",
      user: user,
      users: users,
      myID: userId,
      contacts: contacts,
      notifications: notifications,
      accept: accept,
      reject: reject,
      friends: friends,
      discussions: data?.roomDetails,
    });

  }).catch((e) => {

  })

  // ROOMS INTEGRATION END


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




const getData = (room, userId) => {
  return new Promise((resolve, reject) => {

    try {

      // ROOMS INTEGRATION START
      const roomDetails = [];
      const roomMessages = [];
      room.filter(async (r) => {
        // returning friend id except yours =========================
        function findFriend(callback) {
          if (JSON.stringify(r.sender) !== JSON.stringify(userId)) {
            return r.sender;
          } else {
            return r.receiver;
          }
        }
        // ===========================================================
        // saving messages
        r.message.filter((m) => {
          roomMessages.push({
            message: m.content,
            day: saveTheday(m.createdAt),
          })
        })
        roomDetails.push({
          roomId: r.room.map((r) => { return r.roomId }),
          myId: userId,
          day: saveTheday(r.createdAt),
          friend: findFriend(),
          message: roomMessages[roomMessages.length - 1],
          messageCount: roomMessages.length,
        })
      })

      resolve({
        roomDetails,
        roomMessages
      })
    }
    catch (e) {
      reject(e)
    }


  })
}


const getRoomUsers = (roomDetails) => {

  return new Promise((resolve, reject) => {


    try {
      const roomUsers = []
      roomDetails.map(async (f) => {
        const friend = await User.find(f.friend)
        roomUsers.push(friend)
      })

      resolve(roomUsers)
    }

    catch (e) {

      reject(e)
    }
  })
}