import { Server } from "socket.io";
import { userActions } from "./controllers/userSocketActions";

export const io = new Server({
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("New connection! ", socket.id);
  userActions(socket);
});

io.listen(8080);

console.log("Socket.IO Listening at 8080");
