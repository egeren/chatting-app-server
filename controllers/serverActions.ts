import { Socket } from "socket.io";
import { userDatas } from "../data";
import { messageDatas } from "../data/messageDatas";
import { roomDatas } from "../data/roomDatas";

export const sendServerData = (socket: Socket) => {
  socket.emit("server-data", {
    users: userDatas,
    rooms: roomDatas,
    messages: messageDatas,
  });
};
