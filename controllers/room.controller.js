const SocketIOManager = require("../app");

SocketIOManager.getInstance().start()
SocketIOManager.getInstance().privateMessage('privateMessage')