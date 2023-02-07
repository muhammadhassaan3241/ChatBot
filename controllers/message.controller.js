import { SocketIOManager } from "../app.js"
import { Message } from "../model/message.model.js"
import { User } from "../model/user.model.js"
import { Notification } from "../model/notification.model.js"
import jsdom from "jsdom"
import { Rooms } from "../model/rooms.model.js"
import { formatAMPM } from "../config/time.js"
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p id="myId">Hello jsdom!</p>`);
const document = dom.window.document;
// ======================================================================== IMPORTING MODULES AND PACKAGES

setTimeout(() => {
    SocketIOManager.getInstance().start(async (socket) => {
        if (socket) {
            //  USER CONNECTION
            SocketIOManager.getInstance().socketOn("user-connected", async (data) => {

            });

            // CREATING NEW ROOMS
            SocketIOManager.getInstance().socketOn("create-room", async (data, user) => {
                try {
                    data.room.map(async (r) => {
                        const findRoom = await Rooms.findOne({ room: r.roomId });
                        if (findRoom) {
                            console.log("room already exist");
                        } else {
                            const newRoom = await Rooms.create({
                                room: r.roomId,
                                messages: r.users,
                            })
                            console.log(newRoom);
                        }
                    })
                } catch (error) {
                    console.log(error);
                }
            });

            // JOINING ROOMS & PRIVATE MESSAGING
            SocketIOManager.getInstance().socketOn("join_room", async (data) => {
                try {
                    const room = data.room;
                    const me = data.me;
                    SocketIOManager.getInstance().roomJoin(room);

                    SocketIOManager.getInstance().socketEmitToSpecificRoom("join_room", room, data, () => {
                        console.log(`${me} joined ${room}`);
                    })

                    SocketIOManager.getInstance().socketOn("message_typing", (data) => {
                        SocketIOManager.getInstance().socketEmitToSpecificRoom("message_typing", room, data, () => {
                            return
                        })
                    });
                    SocketIOManager.getInstance().socketOn("message_typing_stops", (data) => {
                        SocketIOManager.getInstance().socketEmitToSpecificRoom("message_typing_stops", room, data, () => {
                            return
                        })
                    })
                    SocketIOManager.getInstance().socketOn("privateMessage", async (data) => {
                        const getRoom = await Message.findOne({ "room.roomId": data.roomId });
                        const friend = data.receiver_id;
                        console.log(friend);
                        function sent() {
                            if (socket.connected) {
                                return true
                            }
                        }
                        if (getRoom) {
                            getRoom.message.push({
                                sender: data.sender_id,
                                receiver: data.receiver_id,
                                content: data.textMessage,
                                sent: sent(),
                                createdAt: formatAMPM(new Date()),
                            });
                            await getRoom.save();
                        };
                        SocketIOManager.getInstance().socketEmitToSpecificRoom("privateMessage", room, getRoom.message, () => {
                            console.log("Private Emitted");
                        })
                    })
                } catch (error) {
                    console.log(error);
                }
            })










































            // // SENDING NOTIFICATION
            // SocketIOManager.getInstance().socketOn('sentNotification', async (data) => {      // SENDING FRIEND REQUEST

            //     const senderId = data.sender.id;
            //     const receiverId = data.receiver.id;
            //     const getRoom = await Notification.find({ receiver: receiverId });      // GETTING RECEIVER
            //     if (getRoom.length === 0) {
            //         const notification = await Notification.create({        // CREATING ROOM AND SENDING FREIND REQUEST
            //             sent: true,
            //             socket: data.socket,
            //             sender: senderId,
            //             receiver: receiverId,
            //             senderData: data.sender,
            //             receiverData: data.receiver,
            //             friendRequest: data.message,
            //         })
            //         console.log({ getRoom: 'Friend Request Sent' });
            //         console.log({ socketId: `${data.socket} Connected` });
            //         SocketIOManager.getInstance().socketEmitToSpecificRoom(`sentNotification`, notification, () => {
            //             console.log({ senderSocket: notification.socket })
            //         })

            //     }
            //     if (getRoom.length > 0) {
            //         console.log('you already have sent friend request to this user');
            //     }

            // })

            // // FRIEND REQUEST ACTION
            // SocketIOManager.getInstance().socketOn("acceptedRequest", async (data) => {
            //     const receiverId = data.friend;
            //     console.log(receiverId);
            //     const friendRequest = await Notification.findOneAndDelete({ receiver: receiverId });
            //     if (friendRequest) {
            //         const sender = friendRequest.sender;
            //         const receiver = friendRequest.receiver;
            //         const user1 = await User.findById(sender);
            //         const user2 = await User.findById(receiver);
            //         user1.friends.push(receiver);
            //         user2.friends.push(sender);
            //         await user1.save();
            //         await user2.save();
            //         console.log({ user1: user1.firstName });
            //         console.log({ user2: user2.firstName });
            //         const notification = await Notification.create({
            //             friendRequest: `${user2.firstName} accepted your friend request`,
            //             sender: receiver,
            //             receiver: sender,
            //             senderData: user2,
            //             receiverData: user1,
            //             socket: data.socket,
            //             accept: true,
            //             received: true,
            //             sent: true,
            //         })
            //         SocketIOManager.getInstance().socketEmitToSpecificRoom(`requestAccepted`, notification, () => {
            //             console.log({ senderSocket: notification.socket })
            //         })
            //     }
            // })
        } else {
            { "Socket is not connected" }
        }
    })
}, 1000);

// =============================================================== STOP