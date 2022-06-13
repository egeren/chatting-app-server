import { Server } from "socket.io";
import { userActions } from "./controllers/userSocketActions";
import { readFileSync } from "fs";
import { createServer } from "https";
import { createServer as createHttpServer } from "http";
import dotenv from "dotenv";
import { findUserById, setUserOnline } from "./controllers/userDataActions";

dotenv.config();
const port = process.env.npm_config_port || 8080;

const getServer = () => {
  if (process.env.ENVIRONMENT === "production") {
    return createServer({
      key: readFileSync("../private.key"),
      cert: readFileSync("../certificate.crt"),
    });
  } else {
    return createHttpServer();
  }
};

const httpServer = getServer();

export const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.ENVIRONMENT === "production"
        ? "https://live-chatting-app.vercel.app"
        : "*",
  },
  maxHttpBufferSize: 1e8,
});

io.on("connection", (socket) => {
  console.log("New connection! ", socket.id);
  const user = findUserById(socket.handshake.auth.userId);
  if (user) {
    setUserOnline(user.id);
  }
  userActions(socket);
});

httpServer.listen(port as number);

console.log("Socket.IO Listening at", port);
