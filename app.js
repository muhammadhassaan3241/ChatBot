import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import session from "express-session";
import http from "http";
import hbs from "hbs";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import multer from "multer";
import dotenv from "dotenv";
import path from "path";
import "./database/connection.js";
import "./config/machineId.js";
// ======================================================================== IMPORTING MODULES AND PACKAGES


const app = express(); // ASSIGNING VARIABLE AS EXPRESS
const forms = multer(); // ASSIGNING FORMS AS MULTER
const port = process.env.PORT || 3000; // ASSIGNING 8080 AS PORT
dotenv.config(); // USING ENVIROMENTAL VARIABLES

app.use(            // CREATING EXPRESS SESSION
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

// PACKAGES
// =========================================================================================== START
const accessPath = path.join(process.cwd(), 'assets')
app.use("/fonts", express.static(path.resolve(accessPath, "/assets/fonts"))); // FONTS
app.use("/images", express.static(path.resolve(accessPath, "/assets/img"))); //IMAGES
app.use("/uploads", express.static(path.resolve(accessPath, "uploads"))); // UPLOADS
app.use("/css", express.static(path.resolve(accessPath, "/assets/css"))); // CSS
app.use("/js", express.static(path.resolve(accessPath, "/assets/js"))); // JS
app.use(bodyParser.urlencoded({ extended: false })); // USING BODYPARSER FOR JSON CONTENT TYPE
app.use(express.static("assets")); // STATIC FILES MAIN ROUTE
app.use(bodyParser.json()); // USING BODYPARSER FOR JSON CONTENT TYPE
app.use(cookieParser()); // USING COOKIE PARSER FOR COOKIES
app.use(flash()) // USING FLASH FOR FLASH MESSAGES
// =========================================================================================== STOP

// HANDLEBARS HELPERS START
const viewsPath = path.join(process.cwd(), 'views');
hbs.registerPartials(path.join(viewsPath, 'partials'));
hbs.registerPartials(path.join(viewsPath, 'chat'));

hbs.registerHelper("json", (context) => {
  return JSON.stringify(context);
});
// HANDLEBARS HELPERS END

app.set('view engine', 'hbs') // SETTING TEMPLATING ENGINE

// SERVER
import { Server as SocketServer } from "socket.io";
const server = http.createServer(app);
const io = new SocketServer(server);
io.on('connection', (socket) => {
  console.log("Socket Connected");
})

// ======================================================================== IMPORTING MODULES AND PACKAGES
// SINGLETON PATTERN IMPLEMENTATION
// SINGLETON CLASS

// ============================================================= START
export class SocketIOManager {

  static getInstance() {
    if (!SocketIOManager.instance) {
      SocketIOManager.instance = new SocketIOManager();
    }
    return SocketIOManager.instance;
  }

  constructor() {
    this.logs = [];
  }

  start(callback) {
    io.on("connection", (socket) => {
      this.super_socket = socket;
      callback()
    });
  }

  stop(callback) {
    io.on("disconnect", (socket) => {
      this.super_socket = socket;
      callback()
    });
  }

  getCount() {
    return this.log.length;
  }

  log(message) {
    console.log(message);
  }

  userConnection(user) {
    console.log(`${user} Connected`);
  }

  userJoin(presentRoom) {
    this.super_socket.join(presentRoom)
    console.log(this.super_socket.rooms);
  }

  userLeave(presentRoom) {
    this.super_socket.leave(presentRoom)
    console.log(this.super_socket.rooms);
  }

  dataTransfer(nameSpace, data) {
    this.super_socket.emit(nameSpace, data)
  }

  dataTransferToSpecficRoom(nameSpace, data, callback) {
    if (this.super_socket.rooms[data.receiver]) {
      console.log(this.super_socket.rooms);
      // io.sockets.sockets[data.receiver].emit(nameSpace, data);

      callback()
    }
  }

  dataListen(nameSpace, callback) {
    this.super_socket.on(nameSpace, async (data) => {
      callback(data)
    })
  }

  createNewRoom(newRoom, callback) {
    this.super_socket.on('create_room', (data = newRoom) => {
      this.super_socket.join(data)
      callback()
    })
  }

  privateMessage(nameSpace) {
    this.super_socket.on(nameSpace, async (data) => {

    }
    )
  }

  sendNotification(oldNameSpace) {
    socket.on(oldNameSpace, (data) => {

    });
  }

  turnOnListener(event, callback) {
    console.log(event + this.super_socket);
    this.super_socket.on(event, (data) => {
      console.log("Event received: " + data);
      callback(data)
    })
  }

  // sendEvent(key, event) {
  //   console.log(event + this.super_socket);
  //   this.super_socket.emit(key, event);
  // }
}
// ============================================================= STOP


// MODULES
// =========================================================================================== START
import "./controllers/friendRequest.controller.js"
import "./controllers/message.controller.js"
import accountRoutes from "./routes/account.routes.js";
import userRoutes from "./routes/user.routes.js"
import pagesRoutes from "./pages/pages.js"
app.use('/', accountRoutes);
app.use('/', pagesRoutes);
app.use('/', userRoutes);
// =========================================================================================== STOP


// export * from SocketIOManager;

// starting server
server.listen(port, () => {
  console.log("Server listening on port " + port);
});

// ====================================================================


export default app;