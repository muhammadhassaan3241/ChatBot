import { SocketIOManager } from "../app.js"
import { Notification } from "../model/notification.model.js"
// ======================================================================== IMPORTING MODULES AND PACKAGES

// SINGLETON PATTERNS
// SINGLETON CLASS IMPLEMENTATION
// =============================================================== START
setTimeout((req, res) => {
    SocketIOManager.getInstance().start(() => {
        SocketIOManager.getInstance().dataListen('sentNotification', async (data) => {      // SENDING FRIEND REQUEST
            const getRoom = await Notification.find({ roomId: data.room })      // GETTING ROOM ID
            function roomId(data) {             // CHECKING ROOM ID
                if (getRoom.roomId === data.room) {
                    return getRoom.data.room
                }
                else {
                    return data.room
                }
            }
            if (getRoom.length === 0) {
                const sendingFriendRequest = await Notification.create({        // CREATING ROOM AND SENDING FREIND REQUEST
                    roomId: roomId(data),
                    users: data.sender,
                    friend: data.receiver,
                    friendRequest: data,
                    sent: true,
                })
                console.log({ sendingFriendRequest });
                SocketIOManager.getInstance().dataTransferToSpecficRoom('newFriendRequest', sendingFriendRequest.roomId, sendingFriendRequest)
            }
            if (getRoom.length > 0) {
                console.log('you already have sent friend request');
            }
        })

    })
})
// =============================================================== STOP

