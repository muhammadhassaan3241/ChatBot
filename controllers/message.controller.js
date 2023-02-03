import mongoose from "mongoose";
import { SocketIOManager } from "../app.js"
import { formatAMPM } from "../config/time.js";
import { Message } from "../model/message.model.js"
import { Rooms } from "../model/rooms.model.js";
import { User } from "../model/user.model.js"
// ======================================================================== IMPORTING MODULES AND PACKAGES
// GET USER-ID AND ROOM FROM URL

// SINGLETON PATTERNS
// SINGLETON CLASS IMPLEMENTATION
// =============================================================== START
setTimeout(() => {
    SocketIOManager.getInstance().start(async (socket) => {
        if (socket) {
            setTimeout(() => {
                SocketIOManager.getInstance().dataListen('startNewChat', async (data) => {
                    const user1 = await User.findById(data.myself);
                    const user2 = await User.findById(data.friend);
                    const getRoom = await Message.findOne({
                        $or: [
                            { $and: [{ "room": { $elemMatch: { "users": { $elemMatch: { "user1": data.myself } } } } }, { "room": { $elemMatch: { "users": { $elemMatch: { "user2": data.friend } } } } }] },
                            { $and: [{ "room": { $elemMatch: { "users": { $elemMatch: { "user1": data.friend } } } } }, { "room": { $elemMatch: { "users": { $elemMatch: { "user2": data.myself } } } } }] }
                        ]
                    })
                    if (getRoom) {
                        console.log("room already exist");
                    }
                    else {
                        const newRoom = await Message.create({
                            room: [{
                                roomId: Math.floor(Math.random() * 1000) + Date.now(),
                                socket: socket.id,
                                users: [{
                                    user1: data.myself,
                                    user2: data.friend,
                                }],
                            }],
                            sender: user1,
                            receiver: user2,
                        });
                        console.log("New Room", { newRoom });
                    }
                });
                SocketIOManager.getInstance().dataListen("room", async (room) => {
                    SocketIOManager.getInstance().userLeave(room);
                    SocketIOManager.getInstance().userJoin(room);
                    console.log(`User joined ${room}`);
                    // CHATTING START
                    SocketIOManager.getInstance().dataListen("privateMessage", async (data) => {
                        const messages = await Message.findOne({ "room.roomId": data.roomId });
                        const getRoom = await Rooms.findOne({ user: mongoose.Types.ObjectId(data.receiver_id) });
                        // console.log(getRoom);
                        // function sent() {
                        //     if (socket.connected) {
                        //         return true
                        //     }
                        // }
                        // const myRoom = [];
                        // if (getRoom) {
                        //     getRoom.message.push({
                        //         sender: data.sender_id,
                        //         receiver: data.friendId,
                        //         content: data.textMessage,
                        //         sent: sent(),
                        //         createdAt: formatAMPM(new Date()),
                        //     });
                        //     await getRoom.save();
                        // };
                        // getRoom.message.map(async (m) => {
                        //     const sender = await User.findById(m.sender);
                        //     const receiver = await User.findById(m.receiver);
                        //     myRoom.push({
                        //         sender: sender,
                        //         receiver: receiver,
                        //         content: m.content,
                        //         time: m.createdAt,
                        //     })
                        // });
                        const abc = {
                            content: data.textMessage,
                            time: formatAMPM(new Date())

                        }

                        SocketIOManager.getInstance().dataTransfer("privateMessage", abc, () => {
                            console.log("Private Emitted");
                        })
                    })

                })

            },)
        } else {
            { "Socket is not connected" }
        }
    })
}, 1000);

// =============================================================== STOP