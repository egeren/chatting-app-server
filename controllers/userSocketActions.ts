import { Socket } from "socket.io";
import { io } from "../index";
import { v4 as uuid } from "uuid";
import { addNewUser } from "./userActions";

interface INewUserData {
  username: string;
  avatar: string;
}
export const userActions = (socket: Socket) => {
  socket.on("new-user", (data: INewUserData) => {
    const { username, avatar } = data;
    const id = uuid();
    const userData = { id, username, avatar, isOnline: true };
    addNewUser(id, username, avatar)
      .then(() => {
        socket.emit("logged-in", userData);
      })
      .catch((errorText) => {
        socket.emit("login-error", errorText);
      });
  });
};
