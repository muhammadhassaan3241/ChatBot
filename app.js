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
const port = process.env.PORT || 8080; // ASSIGNING 8080 AS PORT
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
hbs.registerHelper('if_true', function (value, opts) {
  if (value) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});


// HANDLEBARS HELPERS END

app.set('view engine', 'hbs') // SETTING TEMPLATING ENGINE

// SERVER
import { Server as SocketServer } from "socket.io";
const server = http.createServer(app);
const io = new SocketServer(server);
io.on('connection', (socket) => {
  socket.emit('message', 'Welcome to ChatIO')
})

// ======================================================================== IMPORTING MODULES AND PACKAGES
// SINGLETON PATTERN IMPLEMENTATION
// SINGLETON CLASS

// ============================================================= START
export class SocketIOManager {

  static getInstance(io) {
    if (!this.instance) {
      this.lock = true;
      this.instance = new SocketIOManager(io);
      this.lock = false;
    }
    return this.instance;
  }


  constructor(io) {
    this.io = io;
    this.logs = [];
    this.super_socket = undefined;
  }

  log(message) {
    this.logs.push(message);
    console.log(message);
  }

  acceptRequest(callback) {
    callback()
  }

  start(callback) {
    io.on("connection", (socket) => {
      this.super_socket = socket;
      callback(socket)
    });
  }

  stop(callback) {
    this.io.on("disconnect", (socket) => {
      callback(socket);
    });
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

  dataTransferToSpecficRoom(nameSpace, socket, data, callback) {
    this.super_socket.to(socket).emit(nameSpace, data)
    callback()
  }

  dataListen(nameSpace, callback) {
    this.super_socket.on(nameSpace, async (data) => {
      callback(data)
    })
  }

  createNewRoom(newRoom, callback) {
    this.super_socket.join(newRoom, () => {
      callback();
    });
  }

  privateMessage(nameSpace, callback) {
    this.super_socket.on(nameSpace, async (data) => {
      callback(data);
    });
  }

  turnOnListener(event, callback) {
    console.log(event + this.super_socket);
    this.super_socket.on(event, (data) => {
      console.log("Event received: " + data);
      callback(data)
    })
  }

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