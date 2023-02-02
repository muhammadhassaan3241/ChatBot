import { date, formatAMPM, saveTheday } from "../config/time.js";
import { Message } from "../model/message.model.js";
import { Notification } from "../model/notification.model.js";
import { User } from "../model/user.model.js";

export async function getNotifications(req, res, next) {
    try {
        const notifications = [];
        const getNotification = await Notification.find();
        getNotification.filter((n) => {
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
        req.accept = notifications.map((s) => { return s.accept });
        req.reject = notifications.map((s) => { return s.reject });
        req.notifications = notifications;
        next()
    } catch (error) {
        console.log(error);
    }
}

export async function getFriends(req, res, next) {
    try {
        const friends = [];
        const userId = req.user.id;
        const user = await User.findById(userId);
        const fri = user.friends;
        fri.filter(async (f) => {
            const friend = await User.find(f);
            friend.filter((f) => {
                friends.push({
                    id: f.id,
                    name: `${f.firstName} ${f.lastName}`,
                    image: f.image,
                    location: f.location,
                    email: f.email,
                    username: f.username,
                })
            })
        })
        req.friends = friends;
        next()
    } catch (error) {
        console.log(error);
    }
}


export async function getContacts(req, res, next) {
    try {
        const contacts = [];
        const userId = req.user.id;
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
        req.contacts = contacts;
        next()
    } catch (error) {
        console.log(error);
    }
}

export async function getRooms(req, res, next) {
    try {
        const userId = req.user.id;
        const getRoom = await Message.find(
            {
                $or: [
                    { "room": { $elemMatch: { "users": { $elemMatch: { "user1": userId } } } } },
                    { "room": { $elemMatch: { "users": { $elemMatch: { "user2": userId } } } } }
                ]
            });
        /*
        roomId, sockeId, receiverDetails, day, lastMessage.
        */
        const roomDetails = [];
        const myself = await User.findById(userId);
        getRoom.map(async (a) => {
            if (JSON.stringify(a.sender) !== JSON.stringify(userId)) {
                const getUser = await User.findById(a.sender);
                roomDetails.push({
                    id: a.id,
                    roomId: a.room.map((b) => { return b.roomId }),
                    socketId: a.room.map((c) => { return c.socket }),
                    senderDetails: getUser,
                    lastMessage: a.message[a.message.length - 1],
                    allMessages: a.message,
                    messageCount: a.message.length,
                    day: saveTheday(a.createdAt),
                    friendId: a.sender,
                    mySocket: myself.socket,
                    myId: userId,
                })
            } else {
                const getUser = await User.findById(a.receiver);
                roomDetails.push({
                    id: a.id,
                    roomId: a.room.map((b) => { return b.roomId }),
                    socketId: a.room.map((c) => { return c.socket }),
                    senderDetails: getUser,
                    lastMessage: a.message[a.message.length - 1],
                    allMessages: a.message,
                    messageCount: a.message.length,
                    day: saveTheday(a.createdAt),
                    friendId: a.receiver,
                    mySocket: myself.socket,
                    myId: userId,
                })
            }
        })
        req.roomDetails = roomDetails;
        next()
    } catch (error) {
        console.log(error);
    }
}
