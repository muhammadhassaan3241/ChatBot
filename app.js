const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookie = require("cookie-session");
const session = require("express-session");
const http = require("http").createServer(app);
const hbs = require("hbs");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const path = require("path");
const multer = require("multer");
const pages = require('./pages/user');
const user = require('./routes/user.routes');
const userAccount = require('./routes/account.routes');
const { Room } = require("./model/room.model");
const forms = multer();
const port = process.env.PORT || 8080;
require("./config/machineId");
require("dotenv").config();
require("./database/connection");
hbs.registerPartials(__dirname + "/views/partials");
hbs.registerPartials(__dirname + "/views/chat");
hbs.registerHelper("json", (context) => {
  return JSON.stringify(context);
});
app.set('view engine', 'hbs')
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB,
    }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash())
// app.use(express.json());
app.use(cookieParser());
app.use(flash());
app.use(express.static("assets"));
app.use("/css", express.static(path.resolve(__dirname, "/assets/css")));
app.use("/js", express.static(path.resolve(__dirname, "/assets/js")));
app.use("/images", express.static(path.resolve(__dirname, "/assets/img")));
app.use("/fonts", express.static(path.resolve(__dirname, "/assets/fonts")));
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

hbs.registerHelper("json", (context) => {
  return JSON.stringify(context);
});

app.use('/', userAccount);
app.use('/', pages);
app.use('/', user);


const io = require("socket.io")(http);

module.exports = class SocketIOManager {

  static getInstance() {
    if (!SocketIOManager.instance) {
      SocketIOManager.instance = new SocketIOManager();
    }
    return SocketIOManager.instance;
  }

  constructor() {
    this.logs = [];
  }

  start() {
    io.on("connection", (socket) => {
      console.log('Socket Connected');
    });

  }
  getCount() {
    return this.log.length;
  }

  log(message) {
    console.log(message);
  }

  userConnection(user) {
    io.on("connection", (socket) => {
      console.log(`${user} connected`);
      // return socket.id
    })
  }

  userJoin(presentRoom) {
    if (this.userConnected(user)) {
      this.userConnected(user)
      socket.join(presentRoom)
    }
  }

  dataTransfer(nameSpace, data) {
    io.on('connection', (socket) => {
      socket.emit(nameSpace, data)
    })
  }

  dataTransferToSpecficRoom(nameSpace, room, data) {
    socket.to(room).emit(nameSpace, data)
  }

  dataListen(nameSpace) {
    io.on('connection', (socket) => {
      socket.on(nameSpace, (data) => {
        console.log(data);
      })
    })
  }

  createNewRoom(newRoom) {
    io.on('connection', (socket) => {
      socket.join(newRoom)
    })
  }

  privateMessage(nameSpace) {
    io.on('connection', (socket) => {
      socket.on(nameSpace, async (socket, data) => {
        const roomId = this.createNewRoom('room1')
        const room = await Room.create({
          roomId: roomId,
          // users: data.id,
          messages: [{
            content: data.text,
            sent: true,
          }],
        }).then((data) => {
          console.log(data);
        }).catch((err) => {
          console.log(err);
        })
        socket.broadcast.emit(nameSpace, room)
      })
    })
  }
}

require('./controllers/room.controller')


http.listen(port, () => {
  console.log("Server listening on port " + port);
});

// ====================================================================


