import { userDatas } from "../data";
import { v4 as uuid } from "uuid";
import { UserData } from "../data/userDatas";
import { checkEmpty, checkUserData } from "../helpers";
import { tokenDatas } from "../data/tokenDatas";
import { Socket } from "socket.io";
import { roomDatas } from "../data/roomDatas";
import { doesUserInRoom } from "./roomDataActions";

export const findUserById = (userId: string) => {
  const value = userDatas.find((userData) => userData.id === userId);
  return value;
};

export const addNewUser = (
  id: string,
  token: string,
  username: string,
  avatar: string
) => {
  const newUser = {
    id: id,
    username,
    avatar,
    isOnline: true,
  };

  interface NewUserData extends UserData {
    token: string;
  }

  return new Promise<NewUserData>((resolve, reject) => {
    checkUserData(newUser)
      .then(() => {
        userDatas.push(newUser);
        tokenDatas.push({ token: token, userId: newUser.id });
        resolve({ ...newUser, token: token });
      })
      .catch((err) => {
        console.log("rejected error: ", err);
        reject(err);
      });
  });
};

export const setUserOffline = (userId: string) => {
  const index = userDatas.findIndex((userData) => userData.id === userId);
  if (index != -1) {
    userDatas[index].isOnline = false;
  }
  roomDatas.forEach((room) => {
    room.roomUsers.forEach((user) => {
      if (user.id === userId) {
        user.isOnline = false;
      }
    });
  });
};
export const setUserOnline = (userId: string) => {
  const index = userDatas.findIndex((userData) => userData.id === userId);
  if (index != -1) {
    userDatas[index].isOnline = false;
  }
  roomDatas.forEach((room) => {
    room.roomUsers.forEach((user) => {
      if (user.id === userId) {
        user.isOnline = true;
      }
    });
  });
};

export const setUserAvatar = (userId: string, avatar: string) => {
  const index = userDatas.findIndex((userData) => userData.id === userId);
  if (index != -1) {
    userDatas[index].avatar = avatar;
  }
  roomDatas.forEach((room, index) => {
    const userIndex = room.roomUsers.findIndex((user) => user.id === userId);
    if (index != -1) {
      roomDatas[index].roomUsers[userIndex].avatar = avatar;
    }
  });
};

export const GetJoinedRoomIds = (userId: string) => {
  const roomIds = roomDatas.map((room) => {
    const find = doesUserInRoom(userId, room);
    if (find) return room.id;
    else return "";
  });
  return roomIds;
};
