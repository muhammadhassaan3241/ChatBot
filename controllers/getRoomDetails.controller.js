import { User } from "../model/user.model.js"

export async function getRoomDetails(req, res, next) {
    try {
        const roomDetails = [];
        const roomId = req.query.roomId;
        const friendId = req.query.friendId;
        const myId = req.query.myId;
        const me = await User.findById(myId);
        const friend = await User.findById(friendId);
        roomDetails.push({
            me: me,
            friend: friend,
            room: roomId,
        })
        res.send({ roomDetails: roomDetails })
    } catch (error) {
        console.log(error);
    }
}