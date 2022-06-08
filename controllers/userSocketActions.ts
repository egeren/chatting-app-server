import { Socket } from "socket.io";
import {
  addNewUser,
  findUserById,
  GetJoinedRoomIds,
  setUserAvatar,
  setUserOffline,
  setUserOnline,
} from "./userDataActions";
import { sendServerData } from "./serverActions";
import { socketMiddleware } from "../middleware/socketMiddleware";
import {
  addUserToRoom,
  checkRoomData,
  createNewRoom,
  doesUserOwnsRoom,
  findRoomById,
  INewRoomData,
  inviteUsersToRoom,
} from "./roomDataActions";
import { MessageData } from "../data/messageDatas";
import { v4 as uuid } from "uuid";
import { globalRooms, RoomData, roomDatas } from "../data/roomDatas";
import { io } from "..";
import { generateProfileGradient } from "../helpers";
import { UserData } from "../data/userDatas";
import { userDatas } from "../data/userDatas";
import { findUserIdByToken, verifyToken } from "./tokenDataActions";

interface INewUserData {
  username: string;
  avatar: string;
}

export const userActions = (socket: Socket) => {
  socket.use((event, next) => socketMiddleware(socket, event, next));

  socket.on("new-user", (data: INewUserData) => {
    const { username, avatar } = data;
    const { userId, token } = socket.handshake.auth;

    const generatedAvatar =
      avatar == "default" ? generateProfileGradient() : avatar;
    addNewUser(userId, token, username, generatedAvatar)
      .then((user) => {
        globalRooms.map((room) => {
          if (room.isGlobal) {
            socket.join(room.id);
            socket
              .in(room.id)
              .emit("join-room", { roomId: room.id, user: user });
            addUserToRoom(user as UserData, room.id);
          }
        });
        socket.emit("logged-in", user);
        socket.broadcast.emit("new-user", {
          ...(user as object),
          token: undefined,
        });
      })
      .catch((errorText) => {
        socket.emit("error", errorText);
      });
  });

  socket.on("remember-me", () => {
    const { userId, token } = socket.handshake.auth;
    const verify = verifyToken(token, userId);
    if (verify) {
      setUserOnline(userId);
      const user = findUserById(userId);
      const roomIds = GetJoinedRoomIds(userId);
      socket.join(roomIds);
      socket.emit("logged-in", { ...user, token: token });

      socket.broadcast.emit("update-users", userDatas);
    }
  });

  socket.on("request-server-data", () => {
    sendServerData(socket);
  });

  socket.on("send-chat-message", (data) => {
    const { roomId, message } = data;
    const room = findRoomById(roomId);
    if (room) {
      const parsedMessage: MessageData = {
        id: uuid(),
        roomId: roomId,
        message: message,
        timestamp: new Date(),
        userId: socket.handshake.auth.userId,
      };
      room!.roomMessages.push(parsedMessage);

      io.in(room!.id).emit("received-messsage", parsedMessage);
    } else {
      socket.emit("error", "Room not found.");
    }
  });

  socket.on("typing", (data) => {
    const { userId, roomId, username } = data;
    const room = findRoomById(roomId);
    if (room) {
      socket.in(room.id).emit("someone-typing", data);
    }
  });

  socket.on("create-room", (data: INewRoomData) => {
    checkRoomData(data)
      .then(() => {
        const newRoomId = createNewRoom(data);
        socket.join(newRoomId);
        socket.emit("new-room", findRoomById(newRoomId));
      })
      .catch((err) => {
        console.log("create room error", err);
        socket.emit("error", err);
      });
  });

  socket.on("invite-users", (data: { roomId: string; users: UserData[] }) => {
    if (doesUserOwnsRoom(socket.handshake.auth.userId, data.roomId)) {
      inviteUsersToRoom(data.users, data.roomId);
    } else {
      socket.emit("error", "You do not own this room.");
    }
  });

  socket.on("accept-invite", (data: { roomId: string; user: UserData }) => {
    const room = findRoomById(data.roomId);
    if (room) {
      socket.join(room.id);
      socket.in(room.id).emit("join-room", data);
      addUserToRoom(data.user, room.id);
    } else {
      socket.emit("error", "Room not found or deleted.");
    }
  });

  socket.on("photo-change", (data) => {
    const { userId, avatar } = data;
    setUserAvatar(userId, avatar);
    socket.emit("update-users", userDatas);
    socket.broadcast.emit("update-users", userDatas);
    socket.emit("update-rooms", roomDatas);
    socket.broadcast.emit("update-rooms", roomDatas);
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
    setUserOffline(socket.handshake.auth.userId);
    socket.broadcast.emit("update-users", userDatas);
  });
};
