import { SocketIOManager } from "../app.js"
import { formatAMPM } from "../config/time.js"
import { Token } from "../middleware/verifyToken.js"
import { Message } from "../model/message.model.js"
// ======================================================================== IMPORTING MODULES AND PACKAGES


// SINGLETON PATTERNS
// SINGLETON CLASS IMPLEMENTATION
// =============================================================== START
setTimeout(() => {
    SocketIOManager.getInstance().start(() => {
        SocketIOManager.getInstance().dataListen('privateMessage', async (data) => {
            const oldRoom = await Message.findOne({ socket: data.socket });
            if (!oldRoom) {
                const newRoom = await Message.create({
                    roomId: data.room,
                    sender: data.id,
                    messages: data.text,
                    socket: data.socket,
                })
                console.log(newRoom);

            }
            else {
                oldRoom.messages.push(data.text);
                await oldRoom.save()
            }

        })
    })
})

// =============================================================== STOP
