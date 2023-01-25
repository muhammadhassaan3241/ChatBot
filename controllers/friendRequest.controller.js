import { SocketIOManager } from "../app.js"
import { date, formatAMPM, saveTheday } from "../config/time.js"
import { Notification } from "../model/notification.model.js"
import jsdom from "jsdom"
import { User } from "../model/user.model.js";
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p id="myId">Hello jsdom!</p>`);
const document = dom.window.document;
// ======================================================================== IMPORTING MODULES AND PACKAGES

// SINGLETON PATTERNS
// SINGLETON CLASS IMPLEMENTATION
// =============================================================== START
setTimeout(() => {
    SocketIOManager.getInstance().start((socket) => {
        SocketIOManager.getInstance().dataListen('sentNotification', async (data) => {      // SENDING FRIEND REQUEST

            const senderId = data.sender.id;
            const receiverId = data.receiver.id;
            const getRoom = await Notification.find({ receiver: receiverId });      // GETTING RECEIVER
            if (getRoom.length === 0) {
                const notification = await Notification.create({        // CREATING ROOM AND SENDING FREIND REQUEST
                    sent: true,
                    socket: data.socket,
                    sender: senderId,
                    receiver: receiverId,
                    senderData: data.sender,
                    receiverData: data.receiver,
                    friendRequest: data.message,
                })
                console.log({ getRoom: 'Friend Request Sent' });
                console.log({ socketId: `${data.socket} Connected` });
                SocketIOManager.getInstance().dataTransferToSpecficRoom(`sentNotification`, notification, () => {
                    console.log({ senderSocket: notification.socket })
                })

            }
            if (getRoom.length > 0) {
                console.log('you already have sent friend request to this user');
            }

        })
    })
})

// ACCEPTING FRIEND REQUEST
setTimeout(() => {
    SocketIOManager.getInstance().start(() => {
        SocketIOManager.getInstance().dataListen("acceptedRequest", async (data) => {
            const receiverId = data.friend;
            console.log(receiverId);
            const friendRequest = await Notification.findOneAndDelete({ receiver: receiverId });
            if (friendRequest) {
                const sender = friendRequest.sender;
                const receiver = friendRequest.receiver;
                const user1 = await User.findById(sender);
                const user2 = await User.findById(receiver);
                user1.friends.push(receiver);
                user2.friends.push(sender);
                await user1.save();
                await user2.save();
                console.log({ user1: user1.firstName });
                console.log({ user2: user2.firstName });
                const notification = await Notification.create({
                    friendRequest: `${user2.firstName} accepted your friend request`,
                    sender: receiver,
                    receiver: sender,
                    senderData:user2,
                    receiverData:user1,
                    socket: data.socket,
                    accept: true,
                    received: true,
                    sent:true,
                })
                SocketIOManager.getInstance().dataTransferToSpecficRoom(`requestAccepted`, notification, () => {
                console.log({ senderSocket: notification.socket })
                })
            }
        })
    })
}, 4000)

// REJECTING FRIEND REQUEST
// setTimeout(() => {
//     SocketIOManager.getInstance().start(() => {
//         SocketIOManager.getInstance().dataListen("acceptedRequest", async (data) => {
//             const receiverId = data.friend;
//             const friendRequest = await Notification.findOneAndDelete({ receiver: receiverId });
//             if (friendRequest) {
//                 const sender = friendRequest.sender;
//                 const receiver = friendRequest.receiver;
//                 const user1 = await User.findById(sender);
//                 const user2 = await User.findById(receiver);
//                 user1.friends.push(receiver);
//                 user2.friends.push(sender);
//                 await user1.save();
//                 await user2.save();
             
//                 SocketIOManager.getInstance().dataTransferToSpecficRoom(`sentNotification`, notification, () => {
//                     console.log({ senderSocket: notification.socket })
//                 })

//                 console.log({ user1: user1.firstName });
//                 console.log({ user2: user2.firstName });

//             }
//         })
//     })
// }, 4000)

// =============================================================== STOP

