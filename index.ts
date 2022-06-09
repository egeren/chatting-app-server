import { Server } from "socket.io";
import { userActions } from "./controllers/userSocketActions";
import { readFileSync } from "fs";
import { createServer } from "https";

const httpServer = createServer({
  key: readFileSync("../private.key"),
  cert: readFileSync("../certificate.crt"),
});
const port = process.env.npm_config_port || 8080;

export const io = new Server(httpServer, {
  cors: {
    origin: "https://live-chatting-app.vercel.app",
  },
});

io.on("connection", (socket) => {
  console.log("New connection! ", socket.id);

  userActions(socket);
});

httpServer.listen(port as number);

console.log("Socket.IO Listening at", port);
