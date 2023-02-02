import { SocketIOManager } from "../app.js"
import { Message } from "../model/message.model.js"
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

                // CHATTING START
                // SocketIOManager.getInstance().dataListen('roomId', async (data, room = data.mySocket) => {
                //     const getRoom = await Message.findOne({ "room.roomId": data.roomId });
                //     const changeRoom = [];
                //     if (getRoom) {
                //         const friend = await User.findById(data.friendId);
                //         changeRoom.push({
                //             id: friend.id,
                //             email: friend.email,
                //             firstName: friend.firstName,
                //             lastName: friend.lastName,
                //             image: friend.image,
                //             socketId: friend.socket,
                //             mySocket: data.mySocket,
                //             room: data.roomId,
                //         })
                //         console.log({ room });
                //     }

                //     if (room === "") {
                //         SocketIOManager.getInstance().dataTransfer('roomId', changeRoom, () => { console.log("Broadcast to all"); })
                //     } else {
                //         try {
                //             SocketIOManager.getInstance().userLeave(room)
                //             SocketIOManager.getInstance().userJoin(room)
                //             SocketIOManager.getInstance().dataTransferToSpecificRoom('roomId', room, changeRoom, () => { console.log("Broadcast to specific user"); })
                //         } catch (error) {
                //             console.log(error);
                //         }
                //     }
                // })

                SocketIOManager.getInstance().dataListen("privateMessage", async (data) => {
                    const getRoom = await Message.findOne({ "room.roomId": data.roomId });
                    const myRoom = [];
                    if (getRoom) {
                        console.log(getRoom);
                    }
                })
            },)
        } else {
            { "Socket is not connected" }
        }
    })
}, 1000);

// =============================================================== STOP



// const getRoom = await Message.findOne({
            //     $or:
            //         [
            //             { "room": { $elemMatch: { "users": { $elemMatch: { "user1": data.senderId } } } } },
            //             { "room": { $elemMatch: { "users": { $elemMatch: { "user2": data.senderId } } } } }
            //         ]
            // });

            // console.log(getRoom);

            // if (getRoom) {
            //     getRoom.message.push({
            //         sender: data.senderId,
            //         receiver: data.selectedUserId,
            //         content: data.text,
            //     })
            //     await getRoom.save();
            // }