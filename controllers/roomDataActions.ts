import { Socket } from "socket.io";
import { RoomData, roomDatas } from "../data/roomDatas";
import { UserData } from "../data/userDatas";
import { checkEmpty, generateProfileGradient } from "../helpers";
import { v4 as uuid } from "uuid";
import { findTokenByUserId } from "./tokenDataActions";
import { findUserById } from "./userDataActions";
import { io } from "..";

export interface INewRoomData {
  roomName: string;
  userId: string;
  roomAvatar: string;
}

export const findRoomById = (roomId: string) => {
  const value = roomDatas.find((roomData) => roomData.id === roomId);
  if (value) {
    return value;
  }
  return undefined;
};

export const addUserToRoom = (userData: UserData, roomId: string) => {
  const room = findRoomById(roomId);
  if (room) {
    room.roomUsers.push(userData);
  }
};

export const inviteUsersToRoom = (users: UserData[], roomId: string) => {
  users.forEach(async (user) => {
    const room = findRoomById(roomId);
    if (room) {
      const fetch = await io.fetchSockets();
      fetch.map((socket) => {
        if (socket.handshake.auth.userId === user.id) {
          socket.emit("invite-user", room);
        }
      });
    }
  });
};

export const checkRoomData = (data: INewRoomData) => {
  const roomName = checkEmpty(data.roomName);
  const roomAvatar = checkEmpty(data.roomAvatar);
  const userId = checkEmpty(data.userId);
  return new Promise((resolve, reject) => {
    if (roomName) {
      reject("Room name cannot be empty.");
    }
    if (roomAvatar) {
      reject("Room avatar cannot be empty.");
    }
    if (userId) {
      reject("User id cannot be empty.");
    }
    resolve(true);
  });
};

export const createNewRoom = (data: INewRoomData) => {
  const { roomName, userId, roomAvatar } = data;
  const newRoom: RoomData = {
    id: uuid(),
    roomName: roomName,
    roomAvatar:
      roomAvatar == "default" ? generateProfileGradient() : roomAvatar,
    roomUsers: [],
    roomMessages: [],
    isGlobal: false,
    roomCreator: userId,
    roomDescription: "No description set for this room.",
  };
  newRoom.roomUsers.push(findUserById(userId)!);
  roomDatas.push(newRoom);
  return newRoom.id;
};

export const doesUserOwnsRoom = (userId: string, roomId: string) => {
  const room = findRoomById(roomId);
  if (room) {
    return room.roomCreator === userId;
  }
  return false;
};

export const doesUserInRoom = (userId: string, room: RoomData) => {
  return room.roomUsers.find((user) => user.id === userId);
};
