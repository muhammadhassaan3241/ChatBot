import { SocketIOManager } from "../app.js"
import { date, formatAMPM, saveTheday } from "../config/time.js"
import { Notification } from "../model/notification.model.js"
// ======================================================================== IMPORTING MODULES AND PACKAGES

// SINGLETON PATTERNS
// SINGLETON CLASS IMPLEMENTATION
// =============================================================== START
setTimeout(() => {
    SocketIOManager.getInstance().start(() => {
        SocketIOManager.getInstance().dataListen('sentNotification', async (data) => {      // SENDING FRIEND REQUEST

            const senderId = data.sender.senderId;
            const receiverId = data.receiver.receiverId;
            const getRoom = await Notification.find({ receiver: receiverId });      // GETTING RECEIVER
            if (getRoom.length === 0) {
                const notification = new Notification({        // CREATING ROOM AND SENDING FREIND REQUEST
                    sent: true,
                    roomId: data.room,
                    socket: data.socket,
                    sender: senderId,
                    receiver: receiverId,
                    senderData: data.sender,
                    receiverData: data.receiver,
                    friendRequest: data.message,
                })
                console.log({ getRoom: 'Friend Request Sent' });

                // SocketIOManager.getInstance().userJoin(`room-${data.room}`);
                SocketIOManager.getInstance().dataTransferToSpecficRoom('newFriendRequest', notification, () => {
                    console.log("Data has been emitted");
                })
            }
            if (getRoom.length > 0) {
                console.log('you already have sent friend request to this user');
            }
        })

    })
})
// =============================================================== STOP

