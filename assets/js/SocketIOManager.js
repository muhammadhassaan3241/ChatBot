// // ======================================================================== IMPORTING MODULES AND PACKAGES
// // SINGLETON PATTERN IMPLEMENTATION
// // SINGLETON CLASS

// // ============================================================= START
// export class SocketIOManager {

//     static getInstance() {
//         if (!SocketIOManager.instance) {
//             SocketIOManager.instance = new SocketIOManager();
//         }
//         return SocketIOManager.instance;
//     }

//     constructor() {
//         this.logs = [];
//     }

//     start(server, callback) {
//         server.on("connection", (socket) => {
//             this.super_socket = socket;
//             console.log('Socket Connected');
//             callback()
//         });

//     }
//     getCount() {
//         return this.log.length;
//     }

//     log(message) {
//         console.log(message);
//     }

//     userConnection(user) {
//         console.log(`${user} Connected`);
//     }

//     userJoin(presentRoom) {
//         this.super_socket.join(presentRoom)
//     }

//     dataTransfer(nameSpace, data) {
//         this.super_socket.emit(nameSpace, data)
//     }

//     dataTransferToSpecficRoom(nameSpace, room, data) {
//         this.super_socket.to(room).emit(nameSpace, data)
//     }

//     dataListen(nameSpace, callback) {
//         this.super_socket.on(nameSpace, async (data) => {
//             console.log(data);
//             callback()
//         })
//     }

//     createNewRoom(newRoom) {
//         this.super_socket.on('create_room', (data) => {
//             socket.join(newRoom)
//         })
//     }

//     privateMessage(nameSpace) {
//         io.on("connection", socket => {
//             socket.on(nameSpace, async (data) => {
//                 function received() {
//                     if (socket.connected) {
//                         return true
//                     }
//                 }
//                 const getRoom = await Room.findOne({ 'messages.socket': data.socket });
//                 if (getRoom) {
//                     getRoom.messages = [{
//                         socket: socket.id,
//                         received: received(),
//                     }]
//                 }
//                 socket.to(data.socket).emit(nameSpace, getRoom);
//             });
//         });
//     }


//     sendNotification(oldNameSpace, newNameSpace) {
//         io.on('connection', (socket) => {
//             socket.on(oldNameSpace, (data) => {
//                 console.log(data);
//                 // const sender = {
//                 //   content: data.message,
//                 //   senderId: data.sender,
//                 //   senderName: data.senderName,
//                 //   senderImage: data.senderImage,
//                 //   time: (Date.now),
//                 //   day: saveTheday(Date.now()),
//                 // }
//                 // const receiver = {
//                 //   recieverId: data.reciever,
//                 //   receiverName: data.receiverName,
//                 //   receiverImage: data.receiverImage,
//                 //   time: formatAMPM(Date.now),
//                 //   day: saveTheday(Date.now()),
//                 // }

//                 // socket.to(receiver).emit(newNameSpace, sender);
//             });
//         })
//     }

//     turnOnListener(event, callback) {
//         console.log(event + this.super_socket);
//         this.super_socket.on(event, (data) => {
//             console.log("Event received: " + data);
//             callback(data)
//         })
//     }

//     // sendEvent(key, event) {
//     //   console.log(event + this.super_socket);
//     //   this.super_socket.emit(key, event);
//     // }
// }
//   // ============================================================= STOP