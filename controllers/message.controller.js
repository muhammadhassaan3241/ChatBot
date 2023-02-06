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
            SocketIOManager.getInstance().dataListen("room", async (room) => {
                SocketIOManager.getInstance().userLeave(room);
                SocketIOManager.getInstance().userJoin(room)
                console.log(`User joined ${room}`);
                const getRoom = await Message.findOne({ 'room.roomId': room });
                getRoom.message.map((g) => {
                    g.seen = true;
                });
                await getRoom.save();
                // CHATTING START
                SocketIOManager.getInstance().dataListen("privateMessage", async (data) => {
                    const getRoom = await Message.findOne({ "room.roomId": data.roomId });
                    const friend = data.receiver_id;
                    console.log(friend);
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
                    //         receiver: data.receiver_id,
                    //         content: data.textMessage,
                    //         sent: sent(),
                    //         createdAt: formatAMPM(new Date()),
                    //     });
                    //     await getRoom.save();
                    // };


                    SocketIOManager.getInstance().dataTransferToSpecificRoom("privateMessage", room, getRoom.message, () => {
                        console.log("Private Emitted");
                    })
                })

            })
        } else {
            { "Socket is not connected" }
        }
    })
}, 1000);

// =============================================================== STOP