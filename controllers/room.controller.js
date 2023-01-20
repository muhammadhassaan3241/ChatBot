import { SocketIOManager } from "../assets/js/SocketIOManager.js"
// ======================================================================== IMPORTING MODULES AND PACKAGES





// SINGLETON PATTERNS
// SINGLETON CLASS IMPLEMENTATION
// =============================================================== START
setTimeout(() => {
    SocketIOManager.getInstance().start(() => {
        SocketIOManager.getInstance().dataListen('sentNotification', () => {
            return
        })
    })
}, 5000)
// =============================================================== STOP

