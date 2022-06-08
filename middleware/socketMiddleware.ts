import { Event, Socket } from "socket.io";
import { verifyToken } from "../controllers/tokenDataActions";

export const socketMiddleware = (
  socket: Socket,
  event: Event,
  next: (err?: Error) => void
) => {
  if (event[0] === "new-user" || event[0] === "remember-me") {
    next();
  } else {
    const { token, userId } = socket.handshake.auth;
    const verified = verifyToken(token, userId);
    if (verified) {
      next();
    } else {
      console.log("middleware error", token, userId, event[0]);
      socket.emit("error", "You are not authorized.");
    }
  }
};
