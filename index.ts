import { Server } from "socket.io";
import { userActions } from "./controllers/userSocketActions";
import { readFileSync } from "fs";
import { createSecureServer } from "http2";

const httpServer = createSecureServer({
  allowHTTP1: true,
  key: readFileSync("../private.key"),
  cert: readFileSync("../certificate.crt"),
});
const port = process.env.npm_config_port || 8080;

export const io = new Server({
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("New connection! ", socket.id);

  userActions(socket);
});

io.listen(port as number);

console.log("Socket.IO Listening at", port);
