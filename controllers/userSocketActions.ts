import { Socket } from "socket.io";
import { io } from "../index";

import { addNewUser } from "./userDataActions";
import { roomDatas } from "../data/roomDatas";
import { userDatas } from "../data";
import { messageDatas } from "../data/messageDatas";
import { sendServerData } from "./serverActions";

interface INewUserData {
  username: string;
  avatar: string;
}
export const userActions = (socket: Socket) => {
  socket.on("new-user", (data: INewUserData) => {
    const { username, avatar } = data;
    const userData = { username, avatar };
    addNewUser(username, avatar)
      .then((user) => {
        socket.emit("logged-in", user);
      })
      .catch((errorText) => {
        socket.emit("login-error", errorText);
      });
  });

  socket.on("request-server-data", () => {
    sendServerData(socket);
    console.log("server-data sent");
  });
};
