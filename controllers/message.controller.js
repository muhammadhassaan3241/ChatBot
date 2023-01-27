import { SocketIOManager } from "../app.js"
import { Message } from "../model/message.model.js"
// ======================================================================== IMPORTING MODULES AND PACKAGES
// GET USER-ID AND ROOM FROM URL

// SINGLETON PATTERNS
// SINGLETON CLASS IMPLEMENTATION
// =============================================================== START

setTimeout(() => {
    SocketIOManager.getInstance().start((socket) => {
        SocketIOManager.getInstance().dataListen('startNewChat', async (data) => {
            const getRoom = await Message.findOne({ $or: [{ $and: [{ "room": { $elemMatch: { "users": { $elemMatch: { "user1": data.myself } } } } }, { "room": { $elemMatch: { "users": { $elemMatch: { "user2": data.friend } } } } }] }, { $and: [{ "room": { $elemMatch: { "users": { $elemMatch: { "user1": data.friend } } } } }, { "room": { $elemMatch: { "users": { $elemMatch: { "user1": data.myself } } } } }] }] });

            if (getRoom === null) {
                const newRoom = await Message.create({
                    room: [{
                        roomId: Math.floor(Math.random() * 1000) + Date.now(),
                        socket: socket.id,
                        users: [{
                            user1: data.myself,
                            user2: data.friend,
                        }],
                    }],
                    message: [{
                        sender: data.myself,
                        receiver: data.friend,
                        content: data.textMessage,
                        sent: true,
                    }]
                });
                if (newRoom) {
                    SocketIOManager.getInstance().dataTransferToSpecficRoom("startNewChat", socket.id, newRoom, () => {
                        console.log(`socket has been emitted to ${socket.id}`);
                        console.log({ newRoom });
                    })
                }
            } else {
                SocketIOManager.getInstance().dataListen("privateMessage", async (data) => {

                })
            }




        })
    })
})
// =============================================================== STOP
