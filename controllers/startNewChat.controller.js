import { Message } from "../model/message.model.js";
import { User } from "../model/user.model.js"

export async function startNewChat(req, res, next) {
    try {
        const me = req.query.mySelf;
        const friend = req.query.friend;
        const user1 = await User.findById(me);
        const user2 = await User.findById(friend);

        const getRoom = await Message.findOne({
            $or: [
                { $and: [{ "room": { $elemMatch: { "users": { $elemMatch: { "user1": me } } } } }, { "room": { $elemMatch: { "users": { $elemMatch: { "user2": friend } } } } }] },
                { $and: [{ "room": { $elemMatch: { "users": { $elemMatch: { "user1": friend } } } } }, { "room": { $elemMatch: { "users": { $elemMatch: { "user2": me } } } } }] }
            ]
        })
        if (getRoom) {
            console.log("room already exist");
        }
        else {
            const newRoom = await Message.create({
                room: [{
                    roomId: Math.floor(Math.random() * 1000) + Date.now(),
                    users: [{
                        user1: me,
                        user2: friend,
                    }],
                }],
                sender: user1,
                receiver: user2,
            });
            console.log("New Room", { newRoom });
        }


        // res.send({ roomDetails: roomDetails })
    } catch (error) {
        console.log(error);
    }
}

