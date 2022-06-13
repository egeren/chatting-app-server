import { Server } from "socket.io";
import { userActions } from "./controllers/userSocketActions";
import { readFileSync } from "fs";
import { createServer } from "https";
import { createServer as createHttpServer, RequestListener } from "http";
import dotenv from "dotenv";
import { findUserById, setUserOnline } from "./controllers/userDataActions";
import { getImageFromUrl } from "./helpers/imageHandler";

dotenv.config();
const port = process.env.npm_config_port || 8080;

const httpApp: RequestListener = (req, res) => {
  if (req.url === "/") {
    res.writeHead(404);
    res.end();
  } else {
    const photo = getImageFromUrl(req.url);
    if (photo) {
      res.writeHead(200, {
        "Content-Type": "image/jpeg",
      });
      res.end(photo);
    } else {
      res.writeHead(404);
      res.end();
    }
  }
};

const getServer = () => {
  if (process.env.ENVIRONMENT === "production") {
    return createServer(
      {
        key: readFileSync("../private.key"),
        cert: readFileSync("../certificate.crt"),
      },
      httpApp
    );
  } else {
    return createHttpServer(httpApp);
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
