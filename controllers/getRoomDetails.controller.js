import { User } from "../model/user.model.js"

export async function getRoomDetails(req, res, next) {
    try {
        const roomDetails = [];
        const roomId = req.query.roomId;
        const friendId = req.query.friendId;
        const myId = req.query.myId;
        const friend = await User.findById(friendId);
        roomDetails.push({
            friend: friend,
            roomId: roomId,
            myId: myId,
        })
        res.send({ roomDetails: roomDetails })
    } catch (error) {
        console.log(error);
    }
}