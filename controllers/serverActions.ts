import { Socket } from "socket.io";
import { userDatas } from "../data";
import { messageDatas } from "../data/messageDatas";
import { roomDatas } from "../data/roomDatas";
import { findUserById } from "./userDataActions";

export const sendUserData = (socket: Socket) => {
  const user = findUserById(socket.handshake.auth.userId);
  return user;
};

export const sendServerData = (socket: Socket) => {
  const usersRoomDatas = roomDatas.filter((room) => {
    const isRoomCreator = room.roomCreator === socket.handshake.auth.userId;
    const isRoomGlobal = room.isGlobal;
    const isUserInRoom = room.roomUsers.find(
      (user) => user.id === socket.handshake.auth.userId
    );

    if (isRoomCreator || isRoomGlobal || isUserInRoom) {
      return room;
    }
  });

  socket.emit("server-data", {
    users: userDatas,
    rooms: usersRoomDatas,
    messages: messageDatas,
  });
};
