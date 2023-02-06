import { Message } from "../model/message.model.js";
import { User } from "../model/user.model.js"

export async function getRoomDetails(req, res, next) {
    try {
        const roomDetails = [];
        const roomId = req.query.roomId;
        const friendId = req.query.friendId;
        const myId = req.query.myId;
        const friend = await User.findById(friendId);
        const messages = await Message.findOne({ "room.roomId": roomId });
        const textMessages = messages.message;
        roomDetails.push({
            friend: friend,
            roomId: roomId,
            myId: myId,
            messages: textMessages,
        })
        res.send({ roomDetails: roomDetails })
    } catch (error) {
        console.log(error);
    }
}