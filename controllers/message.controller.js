import { SocketIOManager } from "../app.js"
import { Message } from "../model/message.model.js"
// ======================================================================== IMPORTING MODULES AND PACKAGES
// GET USER-ID AND ROOM FROM URL

// SINGLETON PATTERNS
// SINGLETON CLASS IMPLEMENTATION
// =============================================================== START

setTimeout(() => {
    SocketIOManager.getInstance().start(() => {
        SocketIOManager.getInstance().dataListen('privateMessage', async (data) => {

        })
    })
})

// =============================================================== STOP
